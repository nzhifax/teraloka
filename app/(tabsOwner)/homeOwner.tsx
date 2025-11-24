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
import { useLands } from "../../contexts/LandContext";

export default function HomeOwner() {
  const { theme } = useTheme();
  const router = useRouter();
  const { lands = [], setLands } = useLands() || { lands: [], setLands: () => {} };

  // Dummy data (sementara)
  useEffect(() => {
    if (!lands || lands.length === 0) {
      setLands([
        {
          id: "1",
          name: "Sawah Subur Bantul",
          location: "Bantul, Yogyakarta",
          price: 90000000,
          isForSale: true,
          rating: 4.8,
          image:
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
        },
        {
          id: "2",
          name: "Kebun Buah Sleman",
          location: "Sleman, Yogyakarta",
          price: 125000000,
          isForSale: false,
          rating: 4.6,
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        },
      ]);
    }
  }, []);

  const activities = [
    {
      id: 1,
      icon: "mail-outline",
      text: "1 permintaan baru untuk tanah 'Sawah Subur Bantul'",
      time: "2 jam lalu",
    },
    {
      id: 2,
      icon: "heart-outline",
      text: "Tanah 'Kebun Buah Sleman' disukai 3 orang minggu ini",
      time: "Kemarin",
    },
    {
      id: 3,
      icon: "cash-outline",
      text: "Ada 1 calon penyewa mengajukan penawaran",
      time: "3 hari lalu",
    },
  ];

  if (!lands) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text, marginTop: 8 }}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              Selamat Datang Kembali,
            </Text>
            <Text style={[styles.ownerName, { color: theme.primary }]}>
              Pemilik teraloka 🌾
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/addland")}
            style={[styles.addBtn, { backgroundColor: theme.primary }]}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addText}>Tambah Lahan</Text>
          </TouchableOpacity>
        </View>

        {/* Statistik */}
        <View style={styles.statsRow}>
          <StatCard icon="leaf-outline" color="#22C55E" label="Total Lahan" value={lands.length} />
          <StatCard icon="eye-outline" color="#3B82F6" label="Dilihat Minggu Ini" value={248} />
          <StatCard icon="heart-outline" color="#EF4444" label="Favorit" value={18} />
        </View>

        {/* Pendapatan */}
        <View style={styles.incomeCard}>
          <View style={styles.incomeHeader}>
            <Text style={styles.incomeTitle}>Pendapatan Bulan Ini</Text>
            <Ionicons name="wallet-outline" size={20} color={theme.primary} />
          </View>
          <Text style={[styles.incomeValue, { color: theme.primary }]}>Rp 2.450.000</Text>
          <Text style={styles.incomeDesc}>Dari 3 penyewaan aktif</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "70%" }]} />
          </View>
        </View>

        {/* Aktivitas Terbaru */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Aktivitas Terbaru</Text>
        <View style={styles.activityContainer}>
          {activities.map((act) => (
            <View key={act.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: "#F3F4F6" }]}>
                <Ionicons name={act.icon as any} size={18} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.activityText, { color: theme.text }]}>{act.text}</Text>
                <Text style={styles.activityTime}>{act.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Daftar Lahan */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Lahan Anda</Text>
          <TouchableOpacity onPress={() => router.push("/products")}>
            <Text style={[styles.seeAll, { color: theme.primary }]}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {lands.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: theme.textSecondary }}>
            Belum ada lahan terdaftar.
          </Text>
        ) : (
          lands.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() =>
                router.push({ pathname: `/product/${item.id}`, params: { id: item.id } })
              }
            >
              <Image
                source={{ uri: item.image || "https://via.placeholder.com/100" }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardName}>{item.name}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color="#6B7280" />
                  <Text style={styles.cardLoc}>{item.location}</Text>
                </View>
                <Text style={styles.cardPrice}>
                  Rp{item.price.toLocaleString("id-ID")}{" "}
                  <Text style={styles.unitText}>
                    {item.isForSale ? "/ha" : "/tahun"}
                  </Text>
                </Text>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: item.isForSale
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(59,130,246,0.15)",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: item.isForSale ? "#15803D" : "#1D4ED8",
                      fontWeight: "600",
                      fontSize: 12,
                    }}
                  >
                    {item.isForSale ? "Dijual" : "Disewa"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Tombol Map */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        activeOpacity={0.85}
        onPress={() => router.push("/maps")}
      >
        <Ionicons name="map-outline" size={24} color="#FFF" />
        <Text style={styles.fabText}>Lihat di Peta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* Komponen Statistik */
function StatCard({ icon, label, value, color }: any) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + "22" }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  greeting: { fontSize: 14, fontWeight: "500" },
  ownerName: { fontSize: 20, fontWeight: "800" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addText: { color: "#FFF", fontWeight: "600", marginLeft: 6 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 12,
    elevation: 2,
  },
  statIcon: { padding: 6, borderRadius: 8 },
  statValue: { fontWeight: "800", fontSize: 16 },
  statLabel: { fontSize: 12, color: "#6B7280" },
  incomeCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    elevation: 3,
  },
  incomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  incomeTitle: { fontWeight: "700", fontSize: 14 },
  incomeValue: { fontSize: 20, fontWeight: "800", marginTop: 4 },
  incomeDesc: { color: "#6B7280", fontSize: 12, marginBottom: 6 },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
  },
  progressFill: {
    height: 6,
    backgroundColor: "#22C55E",
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 10, marginLeft: 20 },
  seeAll: { fontWeight: "600", fontSize: 13 },
  activityContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  activityIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  activityText: { fontSize: 13, fontWeight: "500" },
  activityTime: { fontSize: 11, color: "#9CA3AF" },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
    overflow: "hidden",
    elevation: 3,
  },
  cardImage: { width: 100, height: 100 },
  cardContent: { flex: 1, padding: 10, justifyContent: "center" },
  cardName: { fontWeight: "700", fontSize: 15 },
  cardLoc: { fontSize: 12, color: "#6B7280", marginLeft: 4 },
  locationRow: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  cardPrice: { fontWeight: "700", color: "#10B981" },
  unitText: { color: "#6B7280", fontSize: 12 },
  statusPill: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 5,
  },
  fabText: { color: "#FFF", marginLeft: 6, fontWeight: "700" },
});
