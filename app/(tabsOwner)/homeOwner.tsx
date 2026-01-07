import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useLands } from "../../contexts/LandContext"; // nanti bisa rename ke PropertyContext

export default function HomeOwner() {
  const { theme } = useTheme();
  const router = useRouter();
  const { lands = [], setLands } = useLands() || {};

  // Dummy data properti
  useEffect(() => {
    if (!lands || lands.length === 0) {
      setLands([
        {
          id: "1",
          name: "Rumah Minimalis Bantul",
          location: "Bantul, Yogyakarta",
          price: 950000000,
          isForSale: true,
          views: 312,
          favorites: 24,
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        },
        {
          id: "2",
          name: "Kos Eksklusif Sleman",
          location: "Sleman, Yogyakarta",
          price: 18000000,
          isForSale: false,
          views: 198,
          favorites: 15,
          image:
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
        },
      ]);
    }
  }, []);

  if (!lands) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text }}>Memuat dashboard properti...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        
        {/* 👋 Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Selamat Datang 👋</Text>
            <Text style={[styles.ownerName, { color: theme.primary }]}>
              Dashboard Properti Anda
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push("/addland")}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.addText}>Tambah</Text>
          </TouchableOpacity>
        </View>

        {/* 💡 Insight */}
        <View style={styles.insightCard}>
          <Ionicons name="bulb-outline" size={20} color="#F59E0B" />
          <Text style={styles.insightText}>
            Properti dengan foto & deskripsi lengkap cenderung lebih cepat diminati.
          </Text>
        </View>

        {/* 📊 Statistik */}
        <View style={styles.statsRow}>
          <Stat icon="home-outline" label="Total Properti" value={lands.length} />
          <Stat icon="eye-outline" label="Total Dilihat" value="510" />
          <Stat icon="heart-outline" label="Favorit" value="39" />
        </View>

        {/* 🏠 Properti */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Properti Aktif</Text>
          <TouchableOpacity onPress={() => router.push("/products")}>
            <Text style={{ color: theme.primary, fontWeight: "600" }}>
              Kelola Semua
            </Text>
          </TouchableOpacity>
        </View>

        {lands.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="home-outline" size={44} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Belum ada properti</Text>
            <Text style={styles.emptyDesc}>
              Tambahkan properti untuk mulai menjangkau pembeli atau penyewa.
            </Text>
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
              onPress={() => router.push("/addland")}
            >
              <Text style={styles.primaryText}>Tambah Properti</Text>
            </TouchableOpacity>
          </View>
        ) : (
          lands.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.propertyCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.propertyImage} />

              <View style={styles.propertyContent}>
                <Text style={styles.propertyName}>{item.name}</Text>
                <Text style={styles.propertyLoc}>{item.location}</Text>

                <Text style={styles.propertyPrice}>
                  Rp{item.price.toLocaleString("id-ID")}
                  <Text style={styles.unit}>
                    {item.isForSale ? " /unit" : " /tahun"}
                  </Text>
                </Text>

                <View style={styles.metaRow}>
                  <Meta icon="eye-outline" value={item.views} />
                  <Meta icon="heart-outline" value={item.favorites} />
                </View>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: item.isForSale ? "#DCFCE7" : "#DBEAFE" },
                ]}
              >
                <Text
                  style={{
                    color: item.isForSale ? "#166534" : "#1D4ED8",
                    fontWeight: "800",
                    fontSize: 11,
                  }}
                >
                  {item.isForSale ? "DIJUAL" : "DISEWA"}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* 🗺️ Floating Map Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => router.push("/maps")}
      >
        <Ionicons name="map-outline" size={22} color="#FFF" />
        <Text style={styles.fabText}>Peta Properti</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ---------- Components ---------- */

function Stat({ icon, label, value }: any) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={18} color="#6B7280" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Meta({ icon, value }: any) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={14} color="#6B7280" />
      <Text style={styles.metaText}>{value}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { fontSize: 14, color: "#6B7280" },
  ownerName: { fontSize: 20, fontWeight: "800" },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addText: { color: "#FFF", fontWeight: "700", marginLeft: 6 },

  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  insightText: { marginLeft: 8, fontSize: 13, color: "#92400E", flex: 1 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  statValue: { fontWeight: "800", fontSize: 16 },
  statLabel: { fontSize: 11, color: "#6B7280" },

  sectionHeader: {
    marginTop: 22,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "800" },

  propertyCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
  },
  propertyImage: { width: "100%", height: 150 },
  propertyContent: { padding: 12 },
  propertyName: { fontWeight: "800", fontSize: 15 },
  propertyLoc: { fontSize: 12, color: "#6B7280", marginVertical: 2 },
  propertyPrice: { fontWeight: "800", color: "#10B981" },
  unit: { fontSize: 12, color: "#6B7280" },

  metaRow: { flexDirection: "row", marginTop: 6 },
  metaItem: { flexDirection: "row", alignItems: "center", marginRight: 12 },
  metaText: { fontSize: 12, marginLeft: 4 },

  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  fab: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 6,
  },
  fabText: { color: "#FFF", fontWeight: "800", marginLeft: 6 },

  emptyState: {
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 30,
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", marginTop: 10 },
  emptyDesc: {
    fontSize: 13,
    textAlign: "center",
    color: "#6B7280",
    marginVertical: 8,
  },
  primaryBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  primaryText: { color: "#FFF", fontWeight: "800" },
});
