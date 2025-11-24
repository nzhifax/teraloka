import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import * as Location from "expo-location";
import { useTheme } from "../../contexts/ThemeContext";
import { Input } from "../../components/common/Input";
import { useAuth } from "../../contexts/AuthContext";

export default function Register() {
  const router = useRouter();
  const { theme } = useTheme();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [progress] = useState(new Animated.Value(0));

  // 📋 Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"owner" | "buyer">("owner");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // 🗺️ Map state
  const [region, setRegion] = useState({
    latitude: -6.2,
    longitude: 106.816666,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);

  // 🌊 Progress animation
  const nextStep = () => {
    setStep(2);
    Animated.timing(progress, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const prevStep = () => {
    setStep(1);
    Animated.timing(progress, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  // 📍 Ambil lokasi otomatis
  const handleGetCurrentAddress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Izin Diperlukan", "Aktifkan izin lokasi untuk menentukan posisi Anda.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(location.coords);
      if (geocode.length > 0) {
        const addr = `${geocode[0].street || ""}, ${geocode[0].city || ""}, ${geocode[0].region || ""}`;
        setAddress(addr.trim());
        setMarker(location.coords);
        setRegion({ ...region, ...location.coords });
      }
    } catch (e) {
      Alert.alert("Error", "Tidak dapat mengambil lokasi.");
      console.error(e);
    }
  };

  // 🖱️ Saat peta ditekan
  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    setRegion({ ...region, latitude, longitude });
    const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (geocode.length > 0) {
      const addr = `${geocode[0].street || ""}, ${geocode[0].city || ""}, ${geocode[0].region || ""}`;
      setAddress(addr.trim());
    }
  };

  // 🧾 Daftar akun
  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Mohon isi semua data.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Password tidak sama.");
      return;
    }

    try {
      setLoading(true);
      const result = await register({
        fullName,
        email,
        password,
        phone,
        userType,
        address,
      });
      setLoading(false);

      if (result.success) {
        Alert.alert("Sukses", "Akun berhasil dibuat!");
        router.replace("/auth/login");
      } else {
        Alert.alert("Error", result.message || "Registrasi gagal.");
      }
    } catch (e) {
      setLoading(false);
      Alert.alert("Error", "Terjadi kesalahan saat registrasi.");
      console.error(e);
    }
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["50%", "100%"],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[styles.progressBar, { backgroundColor: theme.primary, width: progressWidth }]}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* STEP 1 */}
          {step === 1 && (
            <View>
              <Text style={[styles.stepTitle, { color: theme.text }]}>Langkah 1: Informasi Akun</Text>
              <Input placeholder="Nama Lengkap" value={fullName} onChangeText={setFullName} icon="person-outline" />
              <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" icon="mail-outline" />
              <Input placeholder="Nomor Telepon" value={phone} onChangeText={setPhone} keyboardType="phone-pad" icon="call-outline" />
              <Input placeholder="Kata Sandi" value={password} onChangeText={setPassword} isPassword icon="lock-closed-outline" />
              <Input placeholder="Konfirmasi Sandi" value={confirmPassword} onChangeText={setConfirmPassword} isPassword icon="lock-closed-outline" />

              {/* Tombol Lanjut */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.primary }]}
                  onPress={nextStep}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Lanjut</Text>
                  <Ionicons name="arrow-forward-outline" size={18} color="#fff" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <View>
              <Text style={[styles.stepTitle, { color: theme.text }]}>Langkah 2: Role & Lokasi</Text>

              {/* Role Selector */}
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Pilih Jenis Pengguna</Text>
              <View style={styles.roleContainer}>
                {[
                  { type: "owner", icon: "home-outline", label: "Pemilik" },
                  { type: "buyer", icon: "cart-outline", label: "Pembeli" },
                ].map((r) => (
                  <TouchableOpacity
                    key={r.type}
                    style={[
                      styles.roleCard,
                      {
                        backgroundColor: userType === r.type ? theme.primary : theme.surface,
                        borderColor: userType === r.type ? theme.primary : theme.border,
                      },
                    ]}
                    onPress={() => setUserType(r.type as "owner" | "buyer")}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={r.icon as any} size={28} color={userType === r.type ? "#fff" : theme.text} />
                    <Text style={[styles.roleText, { color: userType === r.type ? "#fff" : theme.text }]}>{r.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Lokasi */}
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Lokasi Anda</Text>
              <View style={[styles.addressCard, { backgroundColor: theme.surface }]}>
                <View style={styles.addressInputWrapper}>
                  <Ionicons name="location-sharp" size={20} color={theme.primary} style={{ marginRight: 8 }} />
                  <TextInput
                    placeholder="Masukkan alamat atau ambil otomatis..."
                    placeholderTextColor={theme.textSecondary}
                    value={address}
                    onChangeText={setAddress}
                    style={[styles.addressInput, { color: theme.text }]}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.smallButton, { backgroundColor: theme.primary }]}
                  onPress={handleGetCurrentAddress}
                  activeOpacity={0.8}
                >
                  <Ionicons name="navigate-outline" size={18} color="#fff" />
                  <Text style={styles.smallButtonText}>Gunakan Lokasi Saya</Text>
                </TouchableOpacity>

                <View style={styles.mapWrapper}>
                  <MapView style={styles.map} region={region} onPress={handleMapPress}>
                    {marker && <Marker coordinate={marker} />}
                  </MapView>
                  <Text style={[styles.mapHint, { color: theme.textSecondary }]}>
                    Tekan peta untuk memilih lokasi manual
                  </Text>
                </View>
              </View>

              {/* Tombol Navigasi */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.outlineButton, { borderColor: theme.primary }]}
                  onPress={prevStep}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-back-outline" size={18} color={theme.primary} />
                  <Text style={[styles.buttonTextOutline, { color: theme.primary }]}>Kembali</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.primary }]}
                  onPress={handleRegister}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Daftar Sekarang</Text>
                      <Ionicons name="arrow-forward-outline" size={18} color="#fff" style={{ marginLeft: 6 }} />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, flexGrow: 1 },
  progressContainer: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
  },
  progressBar: { height: 6, borderRadius: 4 },
  stepTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  sectionLabel: { fontSize: 14, marginBottom: 8 },

  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  roleCard: {
    width: "42%",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  roleText: { marginTop: 6, fontSize: 16, fontWeight: "600" },

  addressCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  addressInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f9fafb",
  },
  addressInput: { flex: 1, fontSize: 15 },
  smallButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  smallButtonText: { color: "#fff", fontWeight: "600", fontSize: 13, marginLeft: 6 },
  mapWrapper: { borderRadius: 12, overflow: "hidden", marginTop: 12 },
  map: { width: "100%", height: 180 },
  mapHint: { fontSize: 12, textAlign: "center", paddingTop: 8 },

  // Tombol
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    elevation: 2,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  buttonTextOutline: {
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 6,
  },
});
