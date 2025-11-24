import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../contexts/ThemeContext";

interface Land {
  id: string;
  name: string;
  location: string;
  area: string;
  soilType: string;
  priceType: "sale" | "rent";
  currency: "IDR" | "USD";
  price: string;
  unit: string;
  description: string;
  facilities: string[];
  image: string;
  createdAt: string;
}

const STORAGE_KEY = "@lokabumi:lands";

export default function AddLand() {
  const { theme } = useTheme();
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLand, setEditingLand] = useState<Land | null>(null);
  const [form, setForm] = useState({
    name: "",
    location: "",
    area: "",
    soilType: "",
    priceType: "sale" as "sale" | "rent",
    currency: "IDR" as "IDR" | "USD",
    price: "",
    unit: "per m²",
    description: "",
    facilities: [] as string[],
    image: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Load data
  useEffect(() => {
    loadLands();
  }, []);

  const loadLands = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setLands(JSON.parse(data));
    } catch {
      Alert.alert("Error", "Gagal memuat data lahan");
    } finally {
      setLoading(false);
    }
  };

  const saveLands = async (newLands: Land[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLands));
      setLands(newLands);
    } catch {
      Alert.alert("Error", "Gagal menyimpan data");
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin Diperlukan", "Izinkan akses galeri untuk memilih gambar");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setForm({ ...form, image: `data:image/jpeg;base64,${result.assets[0].base64}` });
    }
  };

  const toggleFacility = (facility: string) => {
    const updated = form.facilities.includes(facility)
      ? form.facilities.filter((f) => f !== facility)
      : [...form.facilities, facility];
    setForm({ ...form, facilities: updated });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.area || !form.price || !form.image) {
      Alert.alert("Error", "Lengkapi semua kolom wajib dan pilih gambar!");
      return;
    }

    setSubmitting(true);
    try {
      const newLand: Land = {
        id: editingLand ? editingLand.id : Date.now().toString(),
        ...form,
        createdAt: new Date().toISOString(),
      };

      const updated = editingLand
        ? lands.map((l) => (l.id === editingLand.id ? newLand : l))
        : [...lands, newLand];

      await saveLands(updated);
      Alert.alert("Sukses", editingLand ? "Lahan diperbarui" : "Lahan ditambahkan");
      setModalVisible(false);
      resetForm();
    } catch {
      Alert.alert("Error", "Gagal menyimpan data");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Hapus Lahan", "Yakin ingin menghapus lahan ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          const updated = lands.filter((l) => l.id !== id);
          await saveLands(updated);
          Alert.alert("Sukses", "Lahan dihapus");
        },
      },
    ]);
  };

  const openEditModal = (land: Land) => {
    setEditingLand(land);
    setForm({ ...land });
    setModalVisible(true);
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const resetForm = () => {
    setEditingLand(null);
    setForm({
      name: "",
      location: "",
      area: "",
      soilType: "",
      priceType: "sale",
      currency: "IDR",
      price: "",
      unit: "per m²",
      description: "",
      facilities: [],
      image: "",
    });
  };

  const renderLand = ({ item }: { item: Land }) => (
    <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.location, { color: theme.textSecondary }]}>{item.location}</Text>
        <Text style={[styles.price, { color: theme.primary }]}>
          {item.currency === "IDR" ? "Rp" : "$"} {item.price}
        </Text>
        <Text style={[styles.desc, { color: theme.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <Ionicons name="create-outline" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.text }]}>Lahan Saya</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={openCreateModal}
        >
          <Ionicons name="leaf-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {lands.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="map-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.text }]}>Belum ada data lahan</Text>
          <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
            Tambahkan lahan pertama Anda
          </Text>
        </View>
      ) : (
        <FlatList
          data={lands}
          renderItem={renderLand}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[styles.modal, { backgroundColor: theme.background }]}
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={theme.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {editingLand ? "Edit Lahan" : "Tambah Lahan"}
              </Text>
              <View style={{ width: 28 }} />
            </View>

            {/* Image */}
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {form.image ? (
                <Image source={{ uri: form.image }} style={styles.imagePreview} />
              ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: theme.border }]}>
                  <Ionicons name="camera-outline" size={48} color={theme.textSecondary} />
                  <Text style={{ color: theme.textSecondary, marginTop: 8 }}>Pilih Foto Lahan</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Inputs */}
            {[
              { key: "name", placeholder: "Nama Lahan *" },
              { key: "location", placeholder: "Lokasi Lahan *" },
              { key: "area", placeholder: "Luas (m²) *", keyboardType: "numeric" },
              { key: "soilType", placeholder: "Tipe Tanah (misal: Lempung, Gambut)" },
              { key: "price", placeholder: "Harga Lahan *", keyboardType: "numeric" },
              { key: "unit", placeholder: "Satuan (contoh: per m², per tahun)" },
            ].map((field) => (
              <TextInput
                key={field.key}
                style={[
                  styles.input,
                  { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground },
                ]}
                placeholderTextColor={theme.textSecondary}
                placeholder={field.placeholder}
                keyboardType={field.keyboardType || "default"}
                value={(form as any)[field.key]}
                onChangeText={(text) => setForm({ ...form, [field.key]: text })}
              />
            ))}

            <TextInput
              style={[
                styles.textArea,
                { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground },
              ]}
              placeholder="Deskripsi Lahan..."
              placeholderTextColor={theme.textSecondary}
              value={form.description}
              multiline
              numberOfLines={4}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />

            <Text style={[styles.facilityTitle, { color: theme.text }]}>Fasilitas:</Text>
            <View style={styles.facilityContainer}>
              {["Air", "Listrik", "Irigasi", "Dekat Jalan", "Legalitas"].map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.facilityButton,
                    { backgroundColor: form.facilities.includes(f) ? theme.primary : theme.surface },
                  ]}
                  onPress={() => toggleFacility(f)}
                >
                  <Text style={{ color: form.facilities.includes(f) ? "#fff" : theme.text }}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.submit, { backgroundColor: theme.primary }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>
                  {editingLand ? "Perbarui Lahan" : "Tambah Lahan"}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingTop: 60 },
  headerText: { fontSize: 22, fontWeight: "bold" },
  addButton: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center" },
  card: { flexDirection: "row", padding: 12, borderRadius: 12, marginHorizontal: 16, marginBottom: 12, elevation: 2 },
  image: { width: 80, height: 80, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: "700" },
  location: { fontSize: 14 },
  price: { fontSize: 16, fontWeight: "700", marginTop: 4 },
  desc: { fontSize: 13, marginTop: 4 },
  actions: { justifyContent: "center", gap: 6, paddingHorizontal: 8 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyText: { fontSize: 20, fontWeight: "700", marginTop: 10 },
  emptySub: { fontSize: 14 },
  modal: { flex: 1 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingTop: 60 },
  modalTitle: { fontSize: 20, fontWeight: "700" },
  imagePicker: { height: 200, borderRadius: 12, marginHorizontal: 20, overflow: "hidden", marginBottom: 20 },
  imagePreview: { width: "100%", height: "100%" },
  imagePlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginHorizontal: 20, marginBottom: 12, fontSize: 14 },
  textArea: { borderWidth: 1, borderRadius: 10, padding: 12, marginHorizontal: 20, marginBottom: 12 },
  facilityTitle: { fontSize: 16, fontWeight: "600", marginHorizontal: 20, marginTop: 10 },
  facilityContainer: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: 20, marginTop: 8, gap: 8 },
  facilityButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  submit: { margin: 20, borderRadius: 10, paddingVertical: 14, alignItems: "center" },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  list: { paddingBottom: 100 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
