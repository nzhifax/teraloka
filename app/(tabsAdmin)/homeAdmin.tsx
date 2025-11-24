import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

export default function HomeAdmin() {
  const { theme } = useTheme();

  const [requests, setRequests] = useState<any[]>([]);

  // dummy data ajuan produk
  useEffect(() => {
    setRequests([
      {
        id: "101",
        seller: "Budi Santoso",
        name: "Sawah Subur Bantul",
        location: "Bantul, Yogyakarta",
        price: 90000000,
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
      },
      {
        id: "102",
        seller: "Siti Aminah",
        name: "Kebun Durian Sleman",
        location: "Sleman, Yogyakarta",
        price: 157000000,
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      },
    ]);
  }, []);

  const handleAccept = (id: string) => {
    setRequests((prev) => prev.filter((item) => item.id !== id));
    console.log("ACCEPT:", id);
  };

  const handleDecline = (id: string) => {
    setRequests((prev) => prev.filter((item) => item.id !== id));
    console.log("DECLINE:", id);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Ajuan Produk</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Verifikasi produk yang diajukan penjual
            </Text>
          </View>
          <Ionicons name="shield-checkmark-outline" size={28} color={theme.primary} />
        </View>

        {requests.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 40, color: theme.textSecondary }}>
            Belum ada ajuan baru.
          </Text>
        ) : (
          requests.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>

                <Text style={styles.seller}>Penjual: {item.seller}</Text>

                <View style={styles.row}>
                  <Ionicons name="location-outline" size={14} color="#6B7280" />
                  <Text style={styles.location}>{item.location}</Text>
                </View>

                <Text style={styles.price}>
                  Rp{item.price.toLocaleString("id-ID")}
                </Text>

                {/* Tombol Action */}
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

  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
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

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  seller: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
    marginBottom: 4,
  },

  row: {
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
    color: "#22C55E",
    marginBottom: 6,
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 6,
  },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },

  acceptBtn: {
    backgroundColor: "#16A34A",
  },

  declineBtn: {
    backgroundColor: "#DC2626",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 4,
  },
});
