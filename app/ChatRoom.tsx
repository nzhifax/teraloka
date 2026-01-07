import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useLands } from "@/contexts/LandContext"; // kalau pakai LandContext

/* ================= TYPES ================= */
type Message = {
  id: string;
  senderId: string;
  senderRole: "buyer" | "owner";
  text: string;
  time: string;
};

/* ================= COMPONENT ================= */
export default function ChatRoom() {
  const { user } = useAuth();
  const router = useRouter();
  const { propertyId, autoMessage } = useLocalSearchParams(); // ambil autoMessage
  const { lands } = useLands(); // ambil data dari context

  const scrollRef = useRef<FlatList>(null);

  if (!user) return null;

  /* ===== ambil data properti ===== */
  const property = lands.find((p) => p.id === propertyId) || {
    id: "unknown",
    name: "Properti tidak ditemukan",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
    price: 0,
    isForSale: true,
    owner: "Pemilik",
    status: "Kosong",
  };

  /* ===== chat state ===== */
  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState((autoMessage as string) || "");

  /* ===== send message ===== */
  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderRole: user.userType === "owner" ? "owner" : "buyer",
      text: input,
      time: "Now",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // scroll ke bawah
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  /* ===== render message ===== */
  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === user.id;

    return (
      <View
        style={[
          styles.messageRow,
          isMe ? styles.right : styles.left,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isMe ? styles.myBubble : styles.otherBubble,
          ]}
        >
          <Text style={[styles.messageText, isMe && { color: "#fff" }]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    );
  };

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>Chat Properti</Text>
            <Text style={styles.headerSub}>{property.name}</Text>
          </View>
        </View>

        {/* ===== PROPERTY PREVIEW ===== */}
        <TouchableOpacity
          style={styles.propertyCard}
          onPress={() => router.push(`/product/${property.id}`)}
        >
          <Image
            source={{ uri: property.image }}
            style={styles.propertyImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.propertyTitle}>{property.name}</Text>
            <Text style={styles.propertyPrice}>
              Rp{Number(property.price).toLocaleString("id-ID")}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{property.status}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ===== CHAT LIST ===== */}
        <FlatList
          ref={scrollRef}
          data={messages}
          keyExtractor={(i) => i.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />

        {/* ===== INPUT ===== */}
        <View style={styles.inputBar}>
          <TextInput
            placeholder="Tulis pesan..."
            value={input}
            onChangeText={setInput}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: { fontWeight: "700", fontSize: 16 },
  headerSub: { fontSize: 12, color: "#6B7280" },

  /* PROPERTY */
  propertyCard: {
    flexDirection: "row",
    padding: 12,
    margin: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    gap: 12,
  },
  propertyImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
  },
  propertyTitle: { fontWeight: "600", fontSize: 14 },
  propertyPrice: {
    fontSize: 13,
    color: "#2563EB",
    marginVertical: 2,
  },
  badge: {
    backgroundColor: "#DCFCE7",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    color: "#166534",
    fontWeight: "600",
  },

  /* CHAT */
  messageRow: {
    marginBottom: 12,
    maxWidth: "75%",
  },
  left: { alignSelf: "flex-start" },
  right: { alignSelf: "flex-end" },

  bubble: {
    padding: 12,
    borderRadius: 14,
  },
  myBubble: {
    backgroundColor: "#2563EB",
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#F3F4F6",
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 14 },
  time: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 4,
  },

  /* INPUT */
  inputBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: "#2563EB",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
