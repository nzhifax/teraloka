import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  FlatList,
} from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

/* =======================
   DUMMY DATA
======================= */
const lands = [
  {
    id: 1,
    name: "Sawah Subur Sleman",
    location: "Sleman, Yogyakarta",
    price: 120000000,
    rating: 4.8,
    type: "sale",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
    coordinate: { latitude: -7.760, longitude: 110.377 },
  },
  {
    id: 2,
    name: "Lahan Strategis Bantul",
    location: "Bantul, Yogyakarta",
    price: 85000000,
    rating: 4.6,
    type: "rent",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
    coordinate: { latitude: -7.840, longitude: 110.325 },
  },
];

/* =======================
   DISTANCE HELPER
======================= */
function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/* =======================
   PROPERTY CARD
======================= */
const PropertyCard = ({ item, active, onPress }: any) => (
  <TouchableOpacity
    style={[styles.card, active && styles.cardActive]}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <Image source={{ uri: item.image }} style={styles.cardImage} />

    <View style={styles.ratingBadge}>
      <Ionicons name="star" size={12} color="#FACC15" />
      <Text style={styles.ratingText}>{item.rating}</Text>
    </View>

    <View style={styles.cardContent}>
      <Text numberOfLines={1} style={styles.cardTitle}>
        {item.name}
      </Text>

      <Text style={styles.cardPrice}>
        Rp {item.price.toLocaleString("id-ID")}
      </Text>

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={12} color="#6B7280" />
        <Text style={styles.cardLocation}>
          {item.location} • {item.distance.toFixed(1)} km
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

/* =======================
   MAIN
======================= */
export default function HomeGuestMap() {
  const mapRef = useRef<MapView>(null);

  const [userLoc, setUserLoc] = useState<any>(null);
  const [radius, setRadius] = useState(15);
  const [activeId, setActiveId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [type, setType] = useState<"all" | "sale" | "rent">("all");
  const [sort, setSort] =
    useState<"distance" | "low" | "high" | "rating">("distance");

  /* USER LOCATION */
  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setUserLoc({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      mapRef.current?.animateToRegion(
        {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        },
        800
      );
    })();
  }, []);

  /* FILTER + SORT */
  const filtered = useMemo(() => {
    if (!userLoc) return [];

    let data = lands
      .map((l) => ({
        ...l,
        distance: getDistanceKm(
          userLoc.latitude,
          userLoc.longitude,
          l.coordinate.latitude,
          l.coordinate.longitude
        ),
      }))
      .filter((l) => l.distance <= radius);

    if (search.trim()) {
      data = data.filter(
        (l) =>
          l.name.toLowerCase().includes(search.toLowerCase()) ||
          l.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type !== "all") {
      data = data.filter((l) => l.type === type);
    }

    if (sort === "distance") data.sort((a, b) => a.distance - b.distance);
    if (sort === "low") data.sort((a, b) => a.price - b.price);
    if (sort === "high") data.sort((a, b) => b.price - a.price);
    if (sort === "rating") data.sort((a, b) => b.rating - a.rating);

    return data;
  }, [userLoc, radius, search, type, sort]);

  return (
    <View style={{ flex: 1 }}>
      {/* SEARCH BAR */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#64748B" />
        <TextInput
          placeholder="Cari lokasi atau nama properti"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* MAP */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        showsUserLocation
      >
        {userLoc && (
          <Circle
            center={userLoc}
            radius={radius * 1000}
            strokeColor="rgba(37,99,235,0.9)"
            fillColor="rgba(37,99,235,0.2)"
          />
        )}

        {filtered.map((l) => (
          <Marker
            key={l.id}
            coordinate={l.coordinate}
            onPress={() => setActiveId(l.id)}
          />
        ))}
      </MapView>

      {/* BOTTOM SHEET */}
      <View style={styles.sheet}>
        {/* FILTER */}
        <View style={styles.filterRow}>
          {["all", "sale", "rent"].map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.filterChip,
                type === t && styles.filterActive,
              ]}
              onPress={() => setType(t as any)}
            >
              <Text
                style={
                  type === t
                    ? styles.filterTextActive
                    : styles.filterText
                }
              >
                {t === "all"
                  ? "Semua"
                  : t === "sale"
                  ? "Dijual"
                  : "Disewa"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SORT */}
        <View style={styles.filterRow}>
          {[
            { k: "distance", l: "Terdekat" },
            { k: "low", l: "Termurah" },
            { k: "high", l: "Termahal" },
            { k: "rating", l: "Rating" },
          ].map((s) => (
            <TouchableOpacity
              key={s.k}
              style={[
                styles.sortChip,
                sort === s.k && styles.sortActive,
              ]}
              onPress={() => setSort(s.k as any)}
            >
              <Text
                style={
                  sort === s.k ? styles.sortTextActive : styles.sortText
                }
              >
                {s.l}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* RADIUS */}
        <Text style={styles.radiusLabel}>
          Radius {radius} km
        </Text>
        <Slider
          minimumValue={1}
          maximumValue={50}
          step={1}
          value={radius}
          onValueChange={setRadius}
        />

        {/* LIST */}
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PropertyCard
              item={item}
              active={activeId === item.id}
              onPress={() => {
                setActiveId(item.id);
                mapRef.current?.animateToRegion(
                  {
                    ...item.coordinate,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  },
                  600
                );
              }}
            />
          )}
        />
      </View>
    </View>
  );
}

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  searchBox: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    height: height * 0.55,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 16,
  },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },

  filterChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
  },

  filterActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  filterText: {
    color: "#334155",
    fontWeight: "600",
  },

  filterTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  sortActive: {
    backgroundColor: "#E0E7FF",
    borderColor: "#2563EB",
  },

  sortText: {
    fontSize: 12,
    color: "#334155",
  },

  sortTextActive: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "700",
  },

  radiusLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    color: "#475569",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
    elevation: 3,
  },

  cardActive: {
    borderWidth: 1,
    borderColor: "#2563EB",
  },

  cardImage: {
    width: "100%",
    height: 140,
  },

  ratingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },

  ratingText: {
    color: "#fff",
    fontSize: 11,
    marginLeft: 4,
  },

  cardContent: {
    padding: 12,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  cardPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2563EB",
    marginTop: 4,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  cardLocation: {
    fontSize: 12,
    marginLeft: 4,
    color: "#6B7280",
  },
});
