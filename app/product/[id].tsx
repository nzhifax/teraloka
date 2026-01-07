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
import { useLands, Land } from "../../contexts/LandContext";

export default function ProductDetail() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { lands } = useLands();

  const idParam = params.id ? String(params.id) : undefined;
  const property: Land | undefined = lands.find((l) => l.id === idParam);

  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | undefined>(undefined);
  const [descExpanded, setDescExpanded] = React.useState(false);

  if (!property) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Properti tidak ditemukan</Text>
      </View>
    );
  }

  // Cover image: prefer `image` (kalau ada), fallback ke images[0]
  const coverFromData = (property as any).image as string | undefined;
  const imageList = (property.images ?? []).filter(Boolean);
  const coverFallback = coverFromData ?? imageList[0];
  const coverImage = selectedImage ?? coverFallback;

  React.useEffect(() => {
    // reset selected image kalau pindah property
    setSelectedImage(undefined);
    setDescExpanded(false);
  }, [property.id]);

  // ===== Bookmark =====
  React.useEffect(() => {
    const checkBookmark = async () => {
      try {
        const raw = await AsyncStorage.getItem("@loka:favorites");
        if (!raw) return;
        const favorites: Land[] = JSON.parse(raw);
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
      let favorites: Land[] = raw ? JSON.parse(raw) : [];

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

  // ===== Share =====
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Cek properti ini: ${property.name} di ${property.location} • Rp${property.price?.toLocaleString(
          "id-ID"
        )}/${property.isForSale ? "jual" : "sewa"}`,
      });
    } catch {}
  };

  // ===== Chat =====
  const handleContactOwner = () => {
    const chatId = `chat-${property.id}`;
    router.push({
      pathname: "/ChatRoom",
      params: {
        chatId,
        propertyId: property.id,
        propertyTitle: property.name,
        ownerName: property.owner,
        status: property.isForSale ? "Dijual" : "Disewa",
      },
    });
  };

  const handleRentOrBuy = () => {
    const chatId = `chat-${property.id}`;
    router.push({
      pathname: "/ChatRoom",
      params: {
        chatId,
        propertyId: property.id,
        propertyTitle: property.name,
        ownerName: property.owner,
        status: property.isForSale ? "Dijual" : "Disewa",
        autoMessage: property.isForSale
          ? `Halo, saya tertarik membeli properti "${property.name}". Apakah masih tersedia?`
          : `Halo, saya tertarik menyewa properti "${property.name}". Bisa kita diskusikan lebih lanjut?`,
      },
    });
  };

  // ===== Helpers =====
  const typeLabel: Record<string, string> = {
    house: "Rumah",
    apartment: "Apartemen",
    shop: "Ruko",
    land: "Tanah",
  };

  const statusLabel: Record<string, string> = {
    available: "Tersedia",
    sold: "Terjual",
    rented: "Disewa",
  };

  const prettyType = property.type ? (typeLabel[property.type] ?? property.type) : "-";
  const prettyStatus = property.status ? (statusLabel[property.status] ?? property.status) : "-";

  const landArea = property.area?.land ?? "-";
  const buildingArea = property.area?.building ?? "-";

  const priceText =
    typeof property.price === "number"
      ? `Rp${property.price.toLocaleString("id-ID")}`
      : "-";

  // ===== Spec items (label manusia) =====
  const specItems: { label: string; value: string }[] = [
    { label: "Tipe Properti", value: prettyType },
    { label: "Transaksi", value: property.isForSale ? "Dijual" : "Disewakan" },
    { label: "Status", value: prettyStatus },
    { label: "Luas Tanah", value: landArea },
    { label: "Luas Bangunan", value: buildingArea },
    { label: "Jenis Tanah", value: property.soilType ?? "-" },
    { label: "Suhu", value: property.temperature ?? "-" },
    { label: "Tanaman", value: property.crop ?? "-" },
    { label: "Pemilik", value: property.owner ?? "-" },
  ];

  // ===== UI bits =====
  const Chip = ({ icon, text }: { icon?: any; text: string }) => (
    <View style={[styles.chip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {icon ? <Ionicons name={icon} size={14} color={theme.textSecondary} /> : null}
      <Text style={[styles.chipText, { color: theme.textSecondary }]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );

  const Badge = ({
    text,
    tone = "default",
  }: {
    text: string;
    tone?: "default" | "success" | "danger" | "warning";
  }) => {
    const toneBg =
      tone === "success"
        ? "rgba(34,197,94,0.12)"
        : tone === "danger"
        ? "rgba(239,68,68,0.12)"
        : tone === "warning"
        ? "rgba(245,158,11,0.12)"
        : "rgba(59,130,246,0.12)";

    const toneBorder =
      tone === "success"
        ? "rgba(34,197,94,0.25)"
        : tone === "danger"
        ? "rgba(239,68,68,0.25)"
        : tone === "warning"
        ? "rgba(245,158,11,0.25)"
        : "rgba(59,130,246,0.25)";

    const toneText =
      tone === "success"
        ? "#16A34A"
        : tone === "danger"
        ? "#DC2626"
        : tone === "warning"
        ? "#D97706"
        : "#2563EB";

    return (
      <View style={[styles.badge, { backgroundColor: toneBg, borderColor: toneBorder }]}>
        <Text style={[styles.badgeText, { color: toneText }]}>{text}</Text>
      </View>
    );
  };

  const statusTone =
    property.status === "available"
      ? "success"
      : property.status === "sold"
      ? "danger"
      : property.status === "rented"
      ? "warning"
      : "default";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.circleBtn, { backgroundColor: "rgba(255,255,255,0.92)" }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: "rgba(255,255,255,0.92)" }]}
            onPress={toggleBookmark}
          >
            <Ionicons
              name={isBookmarked ? "heart" : "heart-outline"}
              size={22}
              color={isBookmarked ? "#EF4444" : theme.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: "rgba(255,255,255,0.92)" }]}
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero */}
      <View>
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.hero} />
        ) : (
          <View style={[styles.hero, { backgroundColor: "#E5E7EB" }]} />
        )}

        {/* Badges overlay */}
        <View style={styles.badgeRow}>
          <Badge text={property.isForSale ? "DIJUAL" : "DISEWA"} tone="default" />
          <Badge text={prettyStatus.toUpperCase()} tone={statusTone as any} />
        </View>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title + Location */}
          <Text style={[styles.name, { color: theme.text }]}>{property.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
            <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.locText, { color: theme.textSecondary }]}>
              {"  "}
              {property.location}
            </Text>
          </View>

          {/* Price */}
          <View style={{ marginTop: 14 }}>
            <Text style={[styles.priceValue, { color: theme.text }]}>{priceText}</Text>
            <Text style={[styles.priceUnit, { color: theme.textSecondary }]}>
              /{property.isForSale ? "jual" : "sewa"}
            </Text>
          </View>

          {/* Quick chips */}
          <View style={styles.chipRow}>
            <Chip icon="home-outline" text={prettyType} />
            <Chip icon="star-outline" text={property.rating ? `${property.rating.toFixed(1)} rating` : "No rating"} />
            <Chip icon="resize-outline" text={`LT ${landArea}`} />
            {property.type !== "land" ? <Chip icon="business-outline" text={`LB ${buildingArea}`} /> : null}
          </View>

          {/* Gallery thumbnails */}
          {imageList.length > 0 ? (
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Foto</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {(coverFromData ? [coverFromData, ...imageList] : imageList).map((uri, idx) => {
                    const isActive = uri === coverImage;
                    return (
                      <TouchableOpacity
                        key={`${uri}-${idx}`}
                        onPress={() => setSelectedImage(uri)}
                        activeOpacity={0.85}
                        style={[
                          styles.thumbWrap,
                          {
                            borderColor: isActive ? theme.primary : theme.border,
                            backgroundColor: theme.surface,
                          },
                        ]}
                      >
                        <Image source={{ uri }} style={styles.thumb} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          ) : null}

          {/* Specs */}
          <View style={[styles.section, { marginTop: 18 }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Spesifikasi</Text>

            <View style={[styles.specCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {specItems.map((item) => (
                <View key={item.label} style={styles.specRow}>
                  <Text style={[styles.specKey, { color: theme.textSecondary }]}>{item.label}</Text>
                  <Text style={[styles.specVal, { color: theme.text }]} numberOfLines={2}>
                    {String(item.value)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Facilities */}
          {property.facilities?.length ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Fasilitas</Text>
              <View style={styles.facilityWrap}>
                {property.facilities.map((f) => (
                  <View
                    key={f}
                    style={[styles.facilityChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  >
                    <Ionicons name="checkmark-circle-outline" size={14} color={theme.textSecondary} />
                    <Text style={[styles.facilityText, { color: theme.textSecondary }]} numberOfLines={1}>
                      {f}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* Description */}
          {property.description ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Deskripsi</Text>
              <Text
                style={[styles.desc, { color: theme.textSecondary }]}
                numberOfLines={descExpanded ? undefined : 3}
              >
                {property.description}
              </Text>
              <TouchableOpacity onPress={() => setDescExpanded((v) => !v)} activeOpacity={0.8}>
                <Text style={[styles.readMore, { color: theme.primary }]}>
                  {descExpanded ? "Tutup" : "Baca selengkapnya"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Owner */}
          <View style={[styles.ownerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="person-circle-outline" size={42} color={theme.primary} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={[styles.ownerName, { color: theme.text }]}>
                {property.owner ?? "Pemilik"}
              </Text>
              <Text style={[styles.ownerOnline, { color: theme.textSecondary }]}>
                {property.isOnline ? "Online" : "Offline"}
              </Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.ownerTag, { color: theme.textSecondary }]}>
                {property.isForSale ? "Dijual" : "Disewakan"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
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
            {property.isForSale ? "Ajukan Pembelian" : "Ajukan Sewa"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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

  hero: { width: "100%", height: 290, backgroundColor: "#E5E7EB" },

  badgeRow: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 12,
    flexDirection: "row",
    gap: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: "800", letterSpacing: 0.3 },

  content: { padding: 20 },

  name: { fontSize: 22, fontWeight: "900" },
  locText: { fontSize: 14 },

  priceValue: { fontSize: 26, fontWeight: "900", marginTop: 4 },
  priceUnit: { fontSize: 13, marginTop: 2 },

  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: "100%",
  },
  chipText: { fontSize: 12, fontWeight: "700" },

  section: { marginTop: 18 },
  sectionTitle: { fontSize: 18, fontWeight: "900" },

  thumbWrap: {
    width: 88,
    height: 62,
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
  },
  thumb: { width: "100%", height: "100%" },

  specCard: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  specKey: { fontSize: 13, flex: 1, paddingRight: 10 },
  specVal: { fontSize: 13, fontWeight: "800", maxWidth: "55%", textAlign: "right" },

  facilityWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  facilityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: "100%",
  },
  facilityText: { fontSize: 12, fontWeight: "700" },

  desc: { marginTop: 10, lineHeight: 20, fontSize: 14 },
  readMore: { marginTop: 8, fontSize: 13, fontWeight: "900" },

  ownerCard: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
  },
  ownerName: { fontSize: 15, fontWeight: "900" },
  ownerOnline: { fontSize: 12, marginTop: 3 },
  ownerTag: { fontSize: 12, fontWeight: "800" },

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
    gap: 6,
  },
  contactText: { fontSize: 15, fontWeight: "900" },
  primaryBtn: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  primaryBtnText: { color: "#FFF", fontSize: 15, fontWeight: "900" },
});
