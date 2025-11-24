import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState, useEffect } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useRouter } from "expo-router";
import { useLands } from "../../contexts/LandContext";

// 🔹 Komponen Card Properti
const PropertyCard = ({ land, onPress }: any) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
    <Image source={{ uri: land.image }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <View style={styles.tagContainer}>
        <Text style={styles.tagText}>{land.type}</Text>
      </View>

      <Text style={styles.landName}>{land.name}</Text>

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={14} color="#6B7280" />
        <Text style={styles.landLocation}>{land.location}</Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.landPrice}>
          Rp{land.price.toLocaleString("id-ID")}{" "}
          <Text style={styles.unitText}>
            {land.isForSale ? "/ha" : "/tahun"}
          </Text>
        </Text>
        <View style={styles.rating}>
          <Ionicons name="star" size={14} color="#FACC15" />
          <Text style={styles.ratingText}>{land.rating}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// 🔹 Komponen Utama
export default function HomeGuest() {
  const { theme } = useTheme();
  const router = useRouter();
  const { lands, setLands } = useLands();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "sale" | "rent">(
    "all"
  );
  const [sortOption, setSortOption] = useState("none");
  const [isSortModalVisible, setSortModalVisible] = useState(false);

  // 🌱 Data Dummy Awal
  useEffect(() => {
    if (lands.length === 0) {
      setLands([
        {
          id: "1",
          name: "Sawah Subur Mlati",
          location: "Sleman, Yogyakarta",
          price: 120000000,
          isForSale: true,
          rating: 4.8,
          type: "Sawah",
          image:
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
        },
        {
          id: "2",
          name: "Lahan Kosong Strategis",
          location: "Kalasan, Sleman",
          price: 85000000,
          isForSale: true,
          rating: 4.6,
          type: "Lahan",
          image:
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
        },
        {
          id: "3",
          name: "Rumah Klasik Jogja",
          location: "Umbulharjo, Yogyakarta",
          price: 65000000,
          isForSale: false,
          rating: 4.7,
          type: "Rumah",
          image:
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
        },
        {
          id: "4",
          name: "Kebun Buah Bantul",
          location: "Bantul, Yogyakarta",
          price: 97000000,
          isForSale: false,
          rating: 4.9,
          type: "Kebun",
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        },
      ]);
    }
  }, []);

  // 🔍 Filter + Sort
  const filteredLands = useMemo(() => {
    let data = lands;

    if (selectedCategory !== "all") {
      data = data.filter((l) =>
        l.type.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (selectedStatus === "sale") data = data.filter((l) => l.isForSale);
    else if (selectedStatus === "rent") data = data.filter((l) => !l.isForSale);

    if (searchQuery.trim()) {
      data = data.filter((l) =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption === "lowToHigh")
      data = [...data].sort((a, b) => a.price - b.price);
    else if (sortOption === "highToLow")
      data = [...data].sort((a, b) => b.price - a.price);
    else if (sortOption === "rating")
      data = [...data].sort((a, b) => b.rating - a.rating);

    return data;
  }, [lands, searchQuery, selectedCategory, selectedStatus, sortOption]);

  const categories = [
    { key: "all", label: "Semua", icon: "earth-outline" },
    { key: "sawah", label: "Sawah", icon: "leaf-outline" },
    { key: "lahan", label: "Lahan", icon: "trail-sign-outline" },
    { key: "rumah", label: "Rumah", icon: "home-outline" },
    { key: "ruko", label: "Ruko", icon: "business-outline" },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Scroll Utama */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* 🔹 Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.brandTitle, { color: theme.primary }]}>
              teraloka
            </Text>
            <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
              Jelajahi tanah, temukan peluang 🌾
            </Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => Alert.alert("Notifikasi", "Belum ada notifikasi baru 🌱")}
          >
            <Ionicons name="notifications-outline" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* 🔹 Pencarian */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Cari sawah, rumah, atau lahan..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={[styles.sortButton, { backgroundColor: theme.primary }]}
            onPress={() => setSortModalVisible(true)}
          >
            <Ionicons name="options-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Kategori */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryItem,
                {
                  backgroundColor:
                    selectedCategory === cat.key ? theme.primary : theme.surface,
                },
              ]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Ionicons
                name={cat.icon as any}
                size={22}
                color={selectedCategory === cat.key ? "#FFF" : theme.text}
              />
              <Text
                style={[
                  styles.categoryLabel,
                  { color: selectedCategory === cat.key ? "#FFF" : theme.text },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 🔹 Filter Status */}
        <View style={styles.statusContainer}>
          {[
            { key: "all", label: "Semua" },
            { key: "sale", label: "Dijual" },
            { key: "rent", label: "Disewa" },
          ].map((status) => (
            <TouchableOpacity
              key={status.key}
              style={[
                styles.statusButton,
                {
                  backgroundColor:
                    selectedStatus === status.key ? theme.primary : theme.surface,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setSelectedStatus(status.key as any)}
            >
              <Text
                style={{
                  color: selectedStatus === status.key ? "#FFF" : theme.text,
                  fontWeight: "600",
                }}
              >
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔹 Rekomendasi */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Rekomendasi Tanah
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: theme.primary }]}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {/* 🔹 List Properti */}
        {filteredLands.map((item) => (
          <PropertyCard
            key={item.id}
            land={item}
            onPress={() =>
              router.push({ pathname: "/product/[id]", params: { id: item.id } })
            }
          />
        ))}
      </ScrollView>

      {/* 🔹 Tombol ke Maps */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.floatingMapButton, { backgroundColor: theme.primary }]}
        onPress={() => router.push("/maps")}
      >
        <Ionicons name="map-outline" size={26} color="#FFF" />
        <Text style={styles.floatingText}>Lihat Peta</Text>
      </TouchableOpacity>

      {/* 🔹 Modal Sort */}
      <Modal visible={isSortModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Urutkan Berdasarkan
            </Text>

            {[
              { key: "lowToHigh", label: "Harga: Termurah" },
              { key: "highToLow", label: "Harga: Termahal" },
              { key: "rating", label: "Rating Tertinggi" },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => {
                  setSortOption(opt.key);
                  setSortModalVisible(false);
                }}
                style={styles.modalOption}
              >
                <Text
                  style={{
                    color: sortOption === opt.key ? theme.primary : theme.text,
                    fontWeight: sortOption === opt.key ? "700" : "400",
                  }}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSortModalVisible(false)}
            >
              <Text style={{ color: theme.error }}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// 🎨 Style
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  brandTitle: { fontSize: 26, fontWeight: "800" },
  brandSubtitle: { fontSize: 13, fontWeight: "400", marginTop: -2 },
  notificationButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 10,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
  sortButton: {
    padding: 8,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryScroll: { paddingHorizontal: 16, paddingVertical: 10 },
  categoryItem: {
    width: 90,
    aspectRatio: 1,
    borderRadius: 16,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryLabel: { marginTop: 6, fontSize: 13, fontWeight: "500" },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  seeAll: { fontSize: 13, fontWeight: "500" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  cardImage: { width: "100%", height: 150 },
  cardContent: { padding: 12 },
  tagContainer: {
    backgroundColor: "#EEF6FF",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  tagText: { fontSize: 11, color: "#2563EB", fontWeight: "600" },
  landName: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  landLocation: { fontSize: 13, color: "#6B7280", marginLeft: 4 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  landPrice: { fontSize: 14, fontWeight: "700", color: "#111" },
  unitText: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
  rating: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 13, marginLeft: 4, color: "#6B7280" },
  floatingMapButton: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 8,
  },
  floatingText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  modalOption: { paddingVertical: 12 },
  closeButton: { marginTop: 20, alignItems: "center" },
});
