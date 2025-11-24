import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Input } from "../../components/common/Input";

export default function Login() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Kesalahan", "Silakan isi semua kolom terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      const result = await login(email, password);
      setLoading(false);

      if (result.success && result.user) {
        const userRole = result.user.userType;

        // 🔁 Redirect berdasarkan role
        if (userRole === "owner") {
          router.replace("/(tabsOwner)/homeOwner");
        } else if (userRole === "buyer") {
          router.replace("/(tabsBuyer)/homeBuyer");
        } else {
          Alert.alert("Kesalahan", "Role pengguna tidak dikenali. Silakan periksa akun Anda.");
        }
      } else {
        Alert.alert("Gagal Masuk", result.message || "Email atau kata sandi salah.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      Alert.alert("Kesalahan", "Terjadi kesalahan saat masuk. Coba lagi nanti.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* 🌟 Header */}
          <View style={styles.header}>
            <View style={[styles.iconWrapper, { backgroundColor: theme.primary }]}>
              <Ionicons name="leaf-outline" size={26} color="#FFF" />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Selamat Datang Kembali 👋</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Senang bertemu lagi! Yuk, masuk untuk melanjutkan.
            </Text>
          </View>

          {/* ✍️ Form Login */}
          <View style={styles.form}>
            <Input
              placeholder="Alamat Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
            />
            <Input
              placeholder="Kata Sandi"
              value={password}
              onChangeText={setPassword}
              isPassword
              icon="lock-closed-outline"
              style={{ marginTop: 16 }}
            />

            {/* 🔑 Lupa Password */}
            <TouchableOpacity
              onPress={() => Alert.alert("Lupa Kata Sandi", "Fitur ini akan segera tersedia.")}
              style={styles.forgotContainer}
            >
              <Text style={[styles.forgotText, { color: theme.primary }]}>
                Lupa kata sandi?
              </Text>
            </TouchableOpacity>

            {/* 🔘 Tombol Masuk */}
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: theme.primary }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginText}>{loading ? "Memuat..." : "Masuk"}</Text>
            </TouchableOpacity>

            {/* ──────── Garis Pembatas ──────── */}
            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.textSecondary }]}>atau</Text>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
            </View>

            {/* 🌐 Login Sosial */}
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#DB4437" }]}>
              <Ionicons name="logo-google" size={20} color="#FFF" />
              <Text style={styles.socialText}>Masuk dengan Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#1877F2" }]}>
              <Ionicons name="logo-facebook" size={20} color="#FFF" />
              <Text style={styles.socialText}>Masuk dengan Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#000" }]}>
              <Ionicons name="logo-apple" size={20} color="#FFF" />
              <Text style={styles.socialText}>Masuk dengan Apple</Text>
            </TouchableOpacity>
          </View>

          {/* 👣 Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Belum punya akun?
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text style={[styles.footerLink, { color: theme.primary }]}> Daftar Sekarang</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconWrapper: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  form: {
    width: "100%",
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "500",
  },
  loginButton: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  loginText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 13,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 12,
  },
  socialText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
