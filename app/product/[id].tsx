import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../contexts/ThemeContext";

// ======= Helpers & Types =======
type Specs = {
  luas: string;
  statusTanah: string;
  sumberAir: string;
  akses: string;
  kondisi: string;
};

type Property = {
  id: string;
  name: string;
  images: string[];
  location: string;
  type: string;
  owner: string;
  price: number;
  unit: "ha" | "tahun";
  forSale: boolean;
  status: "Tersedia" | "Terjual" | "Disewa" | "Kosong";
  description: string;
  specs: Specs;
  rating: number;
  transaksi: number;
  coords?: { latitude: number; longitude: number };
};

const CATALOG: Property[] = [
  {
    id: "1",
    name: "Lahan Subur di Lembang",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
      "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=1200&q=80",
    ],
    location: "Lembang, Bandung Barat",
    type: "Lahan Pertanian",
    owner: "Bapak Danu",
    price: 150_000_000,
    unit: "ha",
    forSale: true,
    status: "Tersedia",
    description:
      "Lahan subur dengan akses jalan mudah, cocok untuk pertanian atau investasi jangka panjang. Dekat sumber air dan pasar lokal. Sertifikat SHM.",
    specs: {
      luas: "2 hektar",
      statusTanah: "SHM (Sertifikat Hak Milik)",
      sumberAir: "Sumber air alami ±200 m",
      akses: "Jalan mobil 3 m, dekat jalan provinsi",
      kondisi: "Tanah datar, siap olah",
    },
    rating: 4.8,
    transaksi: 12,
    coords: { latitude: -6.836, longitude: 107.604 },
  },
  {
    id: "2",
    name: "Ruko Strategis Pinggir Jalan",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
    location: "Denpasar, Bali",
    type: "Ruko",
    owner: "Ibu Rani",
    price: 40_000_000,
    unit: "tahun",
    forSale: false,
    status: "Tersedia",
    description:
      "Ruko 2 lantai pinggir jalan utama, cocok untuk usaha ritel/kuliner. Parkir luas, dekat pusat keramaian.",
    specs: {
      luas: "120 m²",
      statusTanah: "HGB",
      sumberAir: "PDAM",
      akses: "Akses utama kota",
      kondisi: "Siap pakai, semi-furnished",
    },
    rating: 4.9,
    transaksi: 7,
  },
];

// ======= Component =======
export default function PropertyDetail() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const itemParam = typeof params.item === "string" ? params.item : undefined;
  const idParam = params.id ? String(params.id) : undefined;

  const propertyFromParam: Property | undefined = itemParam
    ? JSON.parse(itemParam)
    : undefined;

  const property: Property =
    propertyFromParam ||
    CATALOG.find((p) => p.id === idParam) ||
    CATALOG[0];

  // Bookmark state
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  React.useEffect(() => {
    const checkBookmark = async () => {
      try {
        const raw = await AsyncStorage.getItem("@loka:favorites");
        if (!raw) return;
        const favorites: Property[] = JSON.parse(raw);
        setIsBookmarked(favorites.some((f) => f.id === property.id));
      } catch (e) {
        console.warn("Bookmark read error:", e);
      }
    };
    checkBookmark();
  }, [property.id]);

  const toggleBookmark = async () => {
    try {
      const raw = await AsyncStorage.getItem("@loka:favorites");
      let favorites: Property[] = raw ? JSON.parse(raw) : [];

      if (isBookmarked) {
        favorites = favorites.filter((f) => f.id !== property.id);
        await AsyncStorage.setItem("@loka:favorites", JSON.stringify(favorites));
        setIsBookmarked(false);
        Alert.alert("Dihapus", "Properti dihapus dari bookmark.");
      } else {
        favorites.push(property);
        await AsyncStorage.setItem("@loka:favorites", JSON.stringify(favorites));
        setIsBookmarked(true);
        Alert.alert("Disimpan", "Properti ditambahkan ke bookmark.");
      }
    } catch (e) {
      Alert.alert("Gagal", "Tidak bisa mengubah bookmark saat ini.");
      console.error(e);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Cek properti ini: ${property.name} di ${property.location} • Rp${property.price.toLocaleString("id-ID")}/${property.unit}`,
      });
    } catch {}
  };

  const handleContactOwner = () => {
    Alert.alert("Tanya Pemilik", "Fitur chat akan hadir segera 😊");
  };

  const handleRentOrBuy = () => {
    Alert.alert(
      property.forSale ? "Ajukan Pembelian" : "Ajukan Sewa",
      "Permohonan kamu akan dikirim ke pemilik lahan."
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header overlay */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.circleBtn, { backgroundColor: "rgba(255,255,255,0.9)" }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: "rgba(255,255,255,0.9)" }]}
            onPress={toggleBookmark}
          >
            <Ionicons
              name={isBookmarked ? "heart" : "heart-outline"}
              size={22}
              color={isBookmarked ? "#EF4444" : theme.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: "rgba(255,255,255,0.9)" }]}
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero image */}
      <View>
        <Image source={{ uri: property.images[0] }} style={styles.hero} />
        <View style={styles.photoBadge}>
          <Text style={styles.photoBadgeText}>1/{property.images.length}</Text>
        </View>
        <TouchableOpacity style={styles.viewAllPhotos}>
          <Text style={styles.viewAllPhotosText}>Lihat semua foto</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title */}
          <Text style={[styles.name, { color: theme.text }]}>{property.name}</Text>

          {/* Row: type tag + location */}
          <View style={styles.rowWrap}>
            <View style={[styles.typeTag, { backgroundColor: theme.surface }]}>
              <Text style={[styles.typeTagText, { color: theme.text }]}>{property.type}</Text>
            </View>

            <View style={styles.dot} />
            <View style={styles.locRow}>
              <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.locText, { color: theme.textSecondary }]}>
                {property.location}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <Ionicons name="receipt-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.statsText, { color: theme.textSecondary }]}>
              {property.transaksi} transaksi berhasil pada properti ini
            </Text>
          </View>

          <Text style={[styles.stockInfo, { color: property.status === "Tersedia" ? theme.primary : theme.error }]}>
            {property.status}
          </Text>

          {/* Owner */}
          <View style={[styles.ownerCard, { backgroundColor: theme.surface }]}>
            <Ionicons name="person-circle-outline" size={40} color={theme.primary} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={[styles.ownerName, { color: theme.text }]}>
                {property.forSale ? "Dijual" : "Disewakan"} oleh {property.owner}
              </Text>
              <Text style={[styles.ownerOnline, { color: theme.textSecondary }]}>
                Online 1 jam lalu
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceWrap}>
            <Text style={[styles.price, { color: theme.text }]}>
              <Text style={[styles.priceValue, { color: theme.text }]}>
                Rp{property.price.toLocaleString("id-ID")}
              </Text>
              <Text style={[styles.priceUnit, { color: theme.textSecondary }]}>
                /{property.unit}
              </Text>
            </Text>
            <TouchableOpacity>
              <Text style={[styles.estimateLink, { color: theme.primary }]}>
                Estimasi pembayaran
              </Text>
            </TouchableOpacity>
          </View>

          {/* Keunggulan / Spesifikasi */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Spesifikasi</Text>

            {Object.entries(property.specs).map(([key, val]) => (
              <View key={key} style={styles.specRow}>
                <Text style={[styles.specKey, { color: theme.textSecondary }]}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <Text style={[styles.specVal, { color: theme.text }]}>{val}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Deskripsi</Text>
            <Text style={[styles.desc, { color: theme.textSecondary }]}>
              {property.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer actions */}
      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.contactBtn, { borderColor: theme.primary }]}
          onPress={handleContactOwner}
        >
          <Ionicons name="chatbubble-outline" size={18} color={theme.primary} />
          <Text style={[styles.contactText, { color: theme.primary }]}>Tanya Pemilik</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
          onPress={handleRentOrBuy}
        >
          <Text style={styles.primaryBtnText}>
            {property.forSale ? "Ajukan Pembelian" : "Ajukan Sewa"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ======= Styles =======
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: "absolute",
    zIndex: 20,
    top: 50,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRight: { flexDirection: "row", gap: 10 },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: { width: "100%", height: 280, backgroundColor: "#E5E7EB" },
  photoBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  photoBadgeText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  viewAllPhotos: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  viewAllPhotosText: { fontSize: 12, fontWeight: "600" },

  content: { padding: 20 },
  name: { fontSize: 22, fontWeight: "800", marginBottom: 8 },

  rowWrap: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  typeTag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  typeTagText: { fontSize: 12, fontWeight: "700" },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 8,
  },
  locRow: { flexDirection: "row", alignItems: "center" },
  locText: { fontSize: 14, marginLeft: 4 },

  statsRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  statsText: { fontSize: 13, marginLeft: 6 },

  stockInfo: { fontSize: 14, fontWeight: "700", marginTop: 6 },

  ownerCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  ownerName: { fontSize: 15, fontWeight: "700" },
  ownerOnline: { fontSize: 12, marginTop: 2 },

  priceWrap: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: { fontSize: 16 },
  priceValue: { fontSize: 24, fontWeight: "800" },
  priceUnit: { fontSize: 14, fontWeight: "500" },
  estimateLink: { fontSize: 12, textDecorationLine: "underline" },

  section: { marginTop: 18 },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  specKey: { fontSize: 14 },
  specVal: { fontSize: 14, fontWeight: "600", maxWidth: "60%", textAlign: "right" },
  desc: { fontSize: 14, lineHeight: 22 },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  contactBtn: {
    flex: 1,
    borderWidth: 1.4,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    marginRight: 8,
  },
  contactText: { fontSize: 15, fontWeight: "700", marginLeft: 6 },
  primaryBtn: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  primaryBtnText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
});
