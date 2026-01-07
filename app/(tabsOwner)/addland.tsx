import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const { width } = Dimensions.get("window");
const PRIMARY = "#2563EB";

export default function AddProperty() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    image: "",
    listingType: "Dijual",
    propertyType: "Rumah",
    title: "",
    price: "",
    landSize: "",
    buildingSize: "",
    bedroom: "",
    bathroom: "",
    address: "",
    latitude: 0,
    longitude: 0,
  });

  /* ================= IMAGE ================= */
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      base64: true,
    });
    if (!res.canceled && res.assets[0].base64) {
      setForm({
        ...form,
        image: `data:image/jpeg;base64,${res.assets[0].base64}`,
      });
    }
  };

  /* ================= LOCATION ================= */
  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      const geo = await Location.reverseGeocodeAsync(
        loc.coords
      );

      setForm((p) => ({
        ...p,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        address:
          geo[0]?.street ||
          geo[0]?.city ||
          "Lokasi terdeteksi",
      }));
    })();
  }, []);

  const isLand = form.propertyType === "Tanah";

  /* ================= STEPPER ================= */
  const Stepper = () => (
    <View style={styles.stepper}>
      {[1, 2].map((s) => (
        <React.Fragment key={s}>
          <View
            style={[
              styles.stepCircle,
              step >= s && styles.stepActive,
            ]}
          >
            <Text
              style={[
                styles.stepText,
                step >= s && { color: "#fff" },
              ]}
            >
              {s}
            </Text>
          </View>
          {s === 1 && <View style={styles.stepLine} />}
        </React.Fragment>
      ))}
    </View>
  );

  /* ================= STEP 1 ================= */
  const StepOne = () => (
    <>
      {/* Upload */}
      <TouchableOpacity
        style={styles.imageBox}
        onPress={pickImage}
      >
        {form.image ? (
          <Image
            source={{ uri: form.image }}
            style={styles.image}
          />
        ) : (
          <>
            <Ionicons
              name="camera-outline"
              size={34}
              color="#6B7280"
            />
            <Text style={styles.imageText}>
              Upload Foto Properti
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Listing Type */}
      <Row>
        {["Dijual", "Disewa"].map((t) => (
          <Chip
            key={t}
            label={t}
            active={form.listingType === t}
            onPress={() =>
              setForm({ ...form, listingType: t })
            }
          />
        ))}
      </Row>

      {/* Property Type */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 12 }}
      >
        {["Rumah", "Apartemen", "Tanah", "Kos", "Ruko"].map(
          (t) => (
            <Chip
              key={t}
              label={t}
              active={form.propertyType === t}
              onPress={() =>
                setForm({ ...form, propertyType: t })
              }
            />
          )
        )}
      </ScrollView>

      <Input
        placeholder="Judul Properti"
        value={form.title}
        onChange={(v) =>
          setForm({ ...form, title: v })
        }
      />

      <Input
        placeholder={
          form.listingType === "Disewa"
            ? "Harga / Bulan"
            : "Harga Jual"
        }
        keyboard="numeric"
        value={form.price}
        onChange={(v) =>
          setForm({ ...form, price: v })
        }
      />

      {!isLand && (
        <Row>
          <Input
            small
            placeholder="LB (m²)"
            value={form.buildingSize}
            onChange={(v) =>
              setForm({ ...form, buildingSize: v })
            }
          />
          <Input
            small
            placeholder="KT"
            value={form.bedroom}
            onChange={(v) =>
              setForm({ ...form, bedroom: v })
            }
          />
        </Row>
      )}

      <Next onPress={() => setStep(2)} />
    </>
  );

  /* ================= STEP 2 ================= */
  const StepTwo = () => (
    <>
      <MapView
        style={styles.map}
        region={{
          latitude: form.latitude || -7.8,
          longitude: form.longitude || 110.4,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          draggable
          coordinate={{
            latitude: form.latitude,
            longitude: form.longitude,
          }}
          onDragEnd={(e) =>
            setForm({
              ...form,
              latitude:
                e.nativeEvent.coordinate.latitude,
              longitude:
                e.nativeEvent.coordinate.longitude,
            })
          }
        />
      </MapView>

      <Text style={styles.address}>
        📍 {form.address}
      </Text>

      <TouchableOpacity style={styles.publish}>
        <Text style={styles.publishText}>
          Publish Properti
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            step === 1 ? null : setStep(step - 1)
          }
        >
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Tambah Properti
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <Stepper />

      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 ? <StepOne /> : <StepTwo />}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= COMPONENT ================= */

const Input = ({
  placeholder,
  value,
  onChange,
  small,
  keyboard,
}: any) => (
  <TextInput
    placeholder={placeholder}
    placeholderTextColor="#9CA3AF"
    keyboardType={keyboard}
    value={value}
    onChangeText={onChange}
    style={[
      styles.input,
      small && { width: "48%" },
    ]}
  />
);

const Chip = ({ label, active, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.chip,
      active && styles.chipActive,
    ]}
  >
    <Text
      style={{
        color: active ? "#fff" : "#374151",
        fontWeight: "600",
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const Row = ({ children }: any) => (
  <View style={styles.row}>{children}</View>
);

const Next = ({ onPress }: any) => (
  <TouchableOpacity style={styles.next} onPress={onPress}>
    <Text style={styles.nextText}>Lanjut</Text>
  </TouchableOpacity>
);

/* ================= STYLE ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  stepper: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  stepActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  stepText: {
    fontWeight: "600",
    color: "#9CA3AF",
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: "#E5E7EB",
  },

  content: {
    padding: 16,
    paddingBottom: 120,
  },

  imageBox: {
    height: 180,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  imageText: {
    marginTop: 6,
    color: "#6B7280",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#fff",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  next: {
    backgroundColor: PRIMARY,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },
  nextText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  map: {
    height: 260,
    borderRadius: 16,
    overflow: "hidden",
  },
  address: {
    marginTop: 8,
    fontSize: 13,
    color: "#4B5563",
  },

  publish: {
    backgroundColor: PRIMARY,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },
  publishText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});
