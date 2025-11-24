import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Platform,
  Modal,
  Alert,
  ScrollView,  
} from "react-native";
import MapView, { Marker, Polygon, Circle } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useLands } from "../contexts/LandContext";

const { height } = Dimensions.get("window");

// 🔹 Hitung jarak antara dua titik (km)
const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // radius bumi (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

// 🔹 Hitung luas poligon sederhana
const calculateArea = (coords: any[]) => {
  if (!coords || coords.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    area += coords[i].latitude * coords[j].longitude;
    area -= coords[j].latitude * coords[i].longitude;
  }
  return Math.abs(area / 2).toFixed(3);
};

export default function Maps() {
  const router = useRouter();
  const { theme } = useTheme();
  const { lands } = useLands();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "sale" | "rent">("all");
  const [radius, setRadius] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [selected, setSelected] = useState<any>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [mapType, setMapType] = useState<"standard" | "satellite">("satellite");
  const [locating, setLocating] = useState(false);

  const [region, setRegion] = useState({
    latitude: -7.797068,
    longitude: 110.370529,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });

  // 📍 Ambil posisi user
  const locateMe = async () => {
    try {
      setLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Izin Lokasi Ditolak", "Aktifkan izin lokasi di pengaturan.");
        setLocating(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      setUserLocation(coords);
      setRegion({
        ...region,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    } catch {
      Alert.alert("Gagal", "Tidak bisa mengambil lokasi saat ini.");
    } finally {
      setLocating(false);
    }
  };

  useEffect(() => {
    locateMe();
  }, []);

  // 🔍 Filter pencarian + kategori + radius
  const filteredLands = useMemo(() => {
    let data = lands;

    // filter dijual/disewa
    if (filter !== "all") {
      data =
        filter === "sale"
          ? data.filter((l) => l.isForSale)
          : data.filter((l) => !l.isForSale);
    }

    // search by name
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q)
      );
    }

    // filter radius (jika userLocation ada)
    if (radius && userLocation) {
      data = data.filter((l) => {
        const dist = getDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          l.center.latitude,
          l.center.longitude
        );
        return dist <= radius;
      });
    }

    return data;
  }, [lands, filter, query, radius, userLocation]);

  const openSheet = (land: any) => {
    setSelected(land);
    setSheetVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* MAP */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={region}
        mapType={mapType}
        onRegionChangeComplete={setRegion as any}
      >
        {/* Lokasi user */}
        {userLocation && (
          <>
            <Marker coordinate={userLocation} title="Lokasi Saya">
              <View style={styles.myLocMarker} />
            </Marker>
            {radius && (
              <Circle
                center={userLocation}
                radius={radius * 1000}
                strokeColor="rgba(59,130,246,0.8)"
                fillColor="rgba(59,130,246,0.2)"
              />
            )}
          </>
        )}

        {/* Lahan */}
        {filteredLands.map((land) => (
          <React.Fragment key={land.id}>
            <Polygon
              coordinates={land.coords}
              strokeColor={land.isForSale ? "#F59E0B" : "#10B981"}
              fillColor={
                land.isForSale
                  ? "rgba(245,158,11,0.25)"
                  : "rgba(16,185,129,0.25)"
              }
              strokeWidth={2}
              tappable
              onPress={() => openSheet(land)}
            />
            <Marker
              coordinate={land.center}
              onPress={() => openSheet(land)}
              title={land.name}
              description={land.location}
            />
          </React.Fragment>
        ))}
      </MapView>

      {/* HEADER & FILTERS */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.topBar}>
          <Text style={[styles.brand, { color: theme.text }]}>teraloka Maps</Text>
          <View style={styles.topActions}>
            <TouchableOpacity
              onPress={() =>
                setMapType(mapType === "satellite" ? "standard" : "satellite")
              }
              style={[styles.iconBtn, { backgroundColor: theme.surface }]}
            >
              <Ionicons
                name={mapType === "satellite" ? "layers-outline" : "planet-outline"}
                size={18}
                color={theme.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.iconBtn, { backgroundColor: theme.surface }]}
            >
              <Ionicons name="close" size={18} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchWrap,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={theme.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Cari lahan / lokasi..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} style={styles.clearBtn}>
              <Ionicons name="close" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Status */}
        <View style={styles.filterRow}>
          {[
            { key: "all", label: "Semua" },
            { key: "sale", label: "Dijual" },
            { key: "rent", label: "Disewa" },
          ].map((f) => {
            const active = filter === (f.key as any);
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key as any)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? theme.primary : theme.surface,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: active ? "#fff" : theme.text,
                    fontWeight: "600",
                  }}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Filter Radius */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.radiusRow}
        >
          {[null, 5, 10, 20].map((r) => {
            const active = radius === r;
            const label = r ? `${r} km` : "Semua Jarak";
            return (
              <TouchableOpacity
                key={r ?? "all"}
                style={[
                  styles.radiusBtn,
                  {
                    backgroundColor: active ? theme.primary : theme.surface,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setRadius(r)}
              >
                <Text style={{ color: active ? "#fff" : theme.text }}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* FAB */}
      <View style={styles.fabs}>
        <TouchableOpacity onPress={locateMe} style={styles.fab}>
          <Ionicons
            name={locating ? "locate" : "locate-outline"}
            size={20}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>

      {/* Detail Modal */}
      <Modal visible={sheetVisible} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
            {selected && (
              <>
                <Image source={{ uri: selected.image }} style={styles.sheetImg} />
                <View style={styles.sheetContent}>
                  <Text style={[styles.sheetTitle, { color: theme.text }]}>
                    {selected.name}
                  </Text>
                  <Text style={[styles.sheetLoc, { color: theme.textSecondary }]}>
                    {selected.location}
                  </Text>
                  <Text style={styles.sheetPrice}>
                    Rp{selected.price.toLocaleString("id-ID")}{" "}
                    <Text style={styles.unitText}>
                      {selected.isForSale ? "/ha" : "/tahun"}
                    </Text>
                  </Text>
                  <Text style={styles.info}>
                    Jenis: {selected.type} | Luas: {calculateArea(selected.coords)} km²
                  </Text>

                  <TouchableOpacity
                    style={[styles.detailBtn, { backgroundColor: theme.primary }]}
                    onPress={() => {
                      setSheetVisible(false);
                      router.push({
                        pathname: "/product/[id]",
                        params: { id: selected.id },
                      });
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      Lihat Detail
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSheetVisible(false)}
                    style={styles.closeBtn}
                  >
                    <Text style={{ color: theme.error }}>Tutup</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: "absolute",
    top: Platform.select({ ios: 40, android: 50 }),
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  brand: { fontSize: 18, fontWeight: "800" },
  topActions: { flexDirection: "row", gap: 8 },
  iconBtn: { padding: 8, borderRadius: 10 },
  searchWrap: {
    marginTop: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14 },
  clearBtn: { padding: 6 },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    marginHorizontal: 16,
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
  },
  radiusRow: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  radiusBtn: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
  },
  fabs: {
    position: "absolute",
    right: 16,
    bottom: 24,
    zIndex: 10,
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  myLocMarker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#3B82F6",
    borderWidth: 2,
    borderColor: "#fff",
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
    maxHeight: height * 0.55,
  },
  sheetImg: { width: "100%", height: 160 },
  sheetContent: { padding: 16 },
  sheetTitle: { fontSize: 18, fontWeight: "700" },
  sheetLoc: { fontSize: 13, marginBottom: 6 },
  sheetPrice: { fontSize: 16, fontWeight: "700", color: "#111" },
  unitText: { fontSize: 12, color: "#666" },
  info: { marginTop: 8, color: "#555" },
  detailBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeBtn: { alignItems: "center", paddingVertical: 10, marginTop: 6 },
});
