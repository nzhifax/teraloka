import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useBookmark } from "../../contexts/BookmarkContext";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useBookmark();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Favorit Saya</Text>
        <Text style={styles.subtitle}>
          {favorites.length > 0
            ? `${favorites.length} properti disimpan`
            : "Tidak ada properti favorit"}
        </Text>
      </View>

      {/* EMPTY STATE */}
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-dislike-outline" size={70} color="#D1D5DB" />
          <Text style={styles.emptyText}>Belum ada properti yang kamu simpan</Text>
          <Text style={styles.emptySub}>
            Simpan lahan atau rumah favoritmu untuk dilihat nanti 🌿
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {favorites.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: `/product/${item.id}`,
                  params: { item: JSON.stringify(item) },
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.locRow}>
                  <Ionicons name="location-outline" size={14} color="#6B7280" />
                  <Text style={styles.location}>{item.location}</Text>
                </View>
                <Text style={styles.price}>
                  Rp{item.price?.toLocaleString("id-ID")}{" "}
                  <Text style={styles.unit}>
                    {item.isForSale ? "/ha" : "/tahun"}
                  </Text>
                </Text>
              </View>

              {/* ❤️ Unfavorite Button */}
              <TouchableOpacity
                style={styles.favoriteBtn}
                onPress={() => toggleFavorite(item)}
              >
                <Ionicons name="heart-dislike" size={22} color="#EF4444" />
                <Text style={styles.unfavText}>Unfavorite</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 24,
  },
  emptyText: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  emptySub: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
    fontSize: 13,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    overflow: "hidden",
  },
  image: {
    width: width * 0.3,
    height: width * 0.25,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  name: {
    fontWeight: "700",
    fontSize: 15,
    color: "#111827",
    marginBottom: 2,
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#059669",
  },
  unit: {
    fontSize: 12,
    color: "#6B7280",
  },
  favoriteBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#FEE2E2",
    borderLeftWidth: 1,
    borderLeftColor: "#FCA5A5",
  },
  unfavText: {
    fontSize: 10,
    color: "#EF4444",
    marginTop: 2,
    fontWeight: "600",
  },
});
