import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileGuest() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    // 🧭 Tamu (belum login)
    return (
      <View style={styles.container}>
        <Ionicons name="lock-closed-outline" size={60} color="#2563EB" />
        <Text style={styles.title}>Akses Terbatas 🔒</Text>
        <Text style={styles.subtitle}>
          Silakan masuk atau daftar untuk mengakses profil Anda.
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#2563EB" }]}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.buttonText}>Masuk Sekarang</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#10B981" }]}
          onPress={() => router.push("/auth/register")}
        >
          <Text style={styles.buttonText}>Daftar Akun Baru</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 👤 Pengguna sudah login
  return (
    <View style={styles.container}>
      <Ionicons name="person-circle-outline" size={70} color="#10B981" />
      <Text style={styles.title}>Profil Saya</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Nama Lengkap:</Text>
        <Text style={styles.infoValue}>{user.fullName}</Text>

        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{user.email}</Text>

        <Text style={styles.infoLabel}>Tipe Pengguna:</Text>
        <Text style={styles.infoValue}>
          {user.userType === "owner" ? "Pemilik Lahan" : "Pembeli"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 16, marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 20 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 6,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  infoBox: {
    marginTop: 20,
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 10,
    width: "90%",
  },
  infoLabel: { fontSize: 14, fontWeight: "600", color: "#4B5563" },
  infoValue: { fontSize: 14, marginBottom: 10, color: "#1F2937" },
});
