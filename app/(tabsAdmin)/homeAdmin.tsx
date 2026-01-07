import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

export default function HomeAdmin() {
  const { theme } = useTheme();
  const [requests, setRequests] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Dummy data ajuan produk
  useEffect(() => {
    setRequests([
      {
        id: "101",
        seller: "Budi Santoso",
        name: "Sawah Subur Bantul",
        location: "Bantul, Yogyakarta",
        price: 90000000,
        status: "pending",
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
      },
      {
        id: "102",
        seller: "Siti Aminah",
        name: "Kebun Durian Sleman",
        location: "Sleman, Yogyakarta",
        price: 157000000,
        status: "pending",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      },
    ]);
  }, []);

  const handleAccept = (id: string) => {
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menyetujui produk ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya",
          onPress: () =>
            setRequests((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, status: "accepted" } : item
              )
            ),
        },
      ]
    );
  };

  const handleDecline = (id: string) => {
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menolak produk ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya",
          onPress: () =>
            setRequests((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, status: "declined" } : item
              )
            ),
        },
      ]
    );
  };

  // Filter ajuan sesuai search
  const filteredRequests = requests.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.seller.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>
              Ajuan Produk
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Verifikasi produk yang diajukan penjual
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pendingCount}</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={theme.textSecondary}
            style={{ marginHorizontal: 8 }}
          />
          <TextInput
            placeholder="Cari produk atau penjual..."
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: theme.text }]}
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        {/* List Ajuan */}
        {filteredRequests.length === 0 ? (
          <Text
            style={{
              textAlign: "center",
              marginTop: 40,
              color: theme.textSecondary,
            }}
          >
            Belum ada ajuan baru.
          </Text>
        ) : (
          filteredRequests.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: theme.card }]}>
              <Image source={{ uri: item.image }} style={styles.image} />

              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.seller, { color: theme.textSecondary }]}>
                  Penjual: {item.seller}
                </Text>

                <View style={styles.row}>
                  <Ionicons name="location-outline" size={14} color="#6B7280" />
                  <Text style={styles.location}>{item.location}</Text>
                </View>

                <Text style={styles.price}>Rp{item.price.toLocaleString("id-ID")}</Text>

                {/* Status */}
                {item.status !== "pending" && (
                  <View
                    style={[
                      styles.statusBadge,
                      item.status === "accepted" ? styles.acceptBadge : styles.declineBadge,
                    ]}
                  >
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                  </View>
                )}

                {/* Tombol Action */}
                {item.status === "pending" && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.btn, styles.acceptBtn]}
                      onPress={() => handleAccept(item.id)}
                    >
                      <Ionicons name="checkmark" size={16} color="#fff" />
                      <Text style={styles.btnText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.btn, styles.declineBtn]}
                      onPress={() => handleDecline(item.id)}
                    >
                      <Ionicons name="close" size={16} color="#fff" />
                      <Text style={styles.btnText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { fontSize: 22, fontWeight: "800" },
  subtitle: { fontSize: 13, marginTop: 4 },

  badge: {
    backgroundColor: "#F59E0B",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontWeight: "700" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    height: 40,
  },
  searchInput: { flex: 1, fontSize: 14 },

  card: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 14,
    padding: 10,
    elevation: 3,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
  },

  name: { fontSize: 15, fontWeight: "700" },
  seller: { fontSize: 12, marginTop: 2, marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  location: { fontSize: 12, color: "#6B7280", marginLeft: 4 },
  price: { fontSize: 14, fontWeight: "700", color: "#22C55E", marginBottom: 6 },

  actionRow: { flexDirection: "row", marginTop: 6 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  acceptBtn: { backgroundColor: "#16A34A" },
  declineBtn: { backgroundColor: "#DC2626" },
  btnText: { color: "#fff", fontWeight: "700", marginLeft: 4 },

  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  acceptBadge: { backgroundColor: "#16A34A" },
  declineBadge: { backgroundColor: "#DC2626" },
  statusText: { color: "#fff", fontSize: 10, fontWeight: "700" },
});
