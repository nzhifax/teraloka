import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useLands } from "../../contexts/LandContext";

/* =========================
   PROPERTY CARD
========================= */
const PropertyCard = ({ land, viewMode, onPress }: any) => {
  const isGrid = viewMode === "grid";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.card, isGrid && styles.gridCard]}
    >
      <View>
        <Image source={{ uri: land.image }} style={styles.cardImage} />

        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#FACC15" />
          <Text style={styles.ratingText}>{land.rating}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text numberOfLines={1} style={styles.landName}>
          {land.name}
        </Text>

        <Text style={styles.landPrice}>
          Rp{land.price.toLocaleString("id-ID")}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color="#6B7280" />
          <Text numberOfLines={1} style={styles.landLocation}>
            {land.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/* =========================
   MAIN PAGE
========================= */
export default function HomeGuest() {
  const { theme } = useTheme();
  const { lands, setLands } = useLands();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<"all" | "sale" | "rent">("all");
  const [sortOption, setSortOption] =
    useState<"none" | "lowToHigh" | "highToLow" | "rating">("none");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterVisible, setFilterVisible] = useState(false);

  /* Dummy Data */
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
          image:
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
        },
        {
          id: "2",
          name: "Lahan Strategis Kalasan",
          location: "Kalasan, Sleman",
          price: 85000000,
          isForSale: true,
          rating: 4.6,
          image:
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
        },
        {
          id: "3",
          name: "Rumah Klasik Jogja",
          location: "Umbulharjo, Yogyakarta",
          price: 65000000,
          isForSale: false,
          rating: 4.7,
          image:
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
        },
      ]);
    }
  }, []);

  /* =========================
     FILTER + SORT (FIX)
  ========================= */
  const filteredLands = useMemo(() => {
    let data = [...lands];

    if (searchQuery.trim()) {
      data = data.filter((l) =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus === "sale") {
      data = data.filter((l) => l.isForSale);
    }

    if (selectedStatus === "rent") {
      data = data.filter((l) => !l.isForSale);
    }

    if (sortOption === "lowToHigh") {
      data = [...data].sort((a, b) => a.price - b.price);
    }

    if (sortOption === "highToLow") {
      data = [...data].sort((a, b) => b.price - a.price);
    }

    if (sortOption === "rating") {
      data = [...data].sort((a, b) => b.rating - a.rating);
    }

    return data;
  }, [lands, searchQuery, selectedStatus, sortOption]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.brandTitle, { color: theme.primary }]}>
              Teraloka
            </Text>
            <Text style={styles.subtitle}>
              Jelajahi properti terbaik
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() =>
                setViewMode(viewMode === "grid" ? "list" : "grid")
              }
            >
              <Ionicons
                name={viewMode === "grid" ? "list-outline" : "grid-outline"}
                size={22}
                color={theme.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: theme.primary }]}
              onPress={() => setFilterVisible(true)}
            >
              <Ionicons name="filter-outline" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            placeholder="Cari properti..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* LIST */}
        <View
          style={[
            styles.listWrapper,
            viewMode === "grid" && styles.gridWrapper,
          ]}
        >
          {filteredLands.map((item) => (
            <PropertyCard
              key={item.id}
              land={item}
              viewMode={viewMode}
              onPress={() =>
                router.push({
                  pathname: "/product/[id]",
                  params: { id: item.id },
                })
              }
            />
          ))}
        </View>
      </ScrollView>

      {/* MAP BUTTON */}
      <TouchableOpacity
        style={[styles.mapButton, { backgroundColor: theme.primary }]}
        onPress={() => router.push("/maps")}
      >
        <Ionicons name="map-outline" size={22} color="#FFF" />
        <Text style={styles.mapText}>Lihat Peta</Text>
      </TouchableOpacity>

      {/* FILTER MODAL */}
      <Modal transparent visible={isFilterVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.filterSheet}>
            <Text style={styles.modalTitle}>Filter & Urutkan</Text>

            <View style={styles.chipRow}>
              {["all", "sale", "rent"].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.chip,
                    selectedStatus === s && styles.chipActive,
                  ]}
                  onPress={() => setSelectedStatus(s as any)}
                >
                  <Text
                    style={{
                      color: selectedStatus === s ? "#FFF" : "#333",
                    }}
                  >
                    {s === "all"
                      ? "Semua"
                      : s === "sale"
                      ? "Dijual"
                      : "Disewa"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.chipRow}>
              {[
                { key: "lowToHigh", label: "Termurah" },
                { key: "highToLow", label: "Termahal" },
                { key: "rating", label: "Rating" },
              ].map((o) => (
                <TouchableOpacity
                  key={o.key}
                  style={[
                    styles.chip,
                    sortOption === o.key && styles.chipActive,
                  ]}
                  onPress={() => setSortOption(o.key as any)}
                >
                  <Text
                    style={{
                      color: sortOption === o.key ? "#FFF" : "#333",
                    }}
                  >
                    {o.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={styles.applyText}>Terapkan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brandTitle: {
    fontSize: 26,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
  },

  headerActions: {
    flexDirection: "row",
    gap: 10,
  },

  iconButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.06)",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },

  searchInput: {
    marginLeft: 8,
    fontSize: 15,
    flex: 1,
  },

  listWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  gridWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },

  gridCard: {
    width: "48%",
  },

  cardImage: {
    width: "100%",
    height: 140,
  },

  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },

  ratingText: {
    color: "#FFF",
    fontSize: 11,
    marginLeft: 4,
  },

  cardContent: {
    padding: 12,
  },

  landName: {
    fontSize: 14,
    fontWeight: "700",
  },

  landPrice: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "800",
    color: "#2563EB",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  landLocation: {
    fontSize: 12,
    marginLeft: 4,
    color: "#6B7280",
  },

  mapButton: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 6,
    alignItems: "center",
  },

  mapText: {
    color: "#FFF",
    fontWeight: "700",
    marginLeft: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  filterSheet: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 12,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EEE",
  },

  chipActive: {
    backgroundColor: "#2563EB",
  },

  applyButton: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  applyText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
