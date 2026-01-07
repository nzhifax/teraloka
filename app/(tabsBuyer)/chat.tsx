import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";

/* ================= MOCK ================= */
const CHATS = [
  {
    id: "chat-1",
    propertyTitle: "Rumah Minimalis Sleman",
    status: "Dijual",
    buyerId: "buyer-1",
    buyerName: "Andi Pratama",
    ownerId: "owner-1",
    ownerName: "Pemilik Rumah",
    lastMessage: "Bisa survei besok pagi?",
    unreadBuyer: 0,
    unreadOwner: 2,
  },
];

export default function ChatList() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const isBuyer = user.userType === "buyer";

  const renderItem = ({ item }: any) => {
    const partnerName = isBuyer ? item.ownerName : item.buyerName;
    const unread = isBuyer ? item.unreadBuyer : item.unreadOwner;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/ChatRoom",
            params: {
              chatId: item.id,
              partnerName,
              propertyTitle: item.propertyTitle,
              status: item.status,
            },
          })
        }
      >
        {/* AVATAR */}
        <View style={styles.avatar}>
          <Ionicons name="home-outline" size={22} color="#fff" />
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.name} numberOfLines={1}>
              {partnerName}
            </Text>

            <View
              style={[
                styles.badge,
                item.status === "Dijual"
                  ? styles.badgeSell
                  : styles.badgeRent,
              ]}
            >
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>

          <Text style={styles.property} numberOfLines={1}>
            {item.propertyTitle}
          </Text>

          <Text style={styles.lastMsg} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>

        {/* UNREAD */}
        {unread > 0 && (
          <View style={styles.unread}>
            <Text style={styles.unreadText}>{unread}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pesan</Text>

      <FlatList
        data={CHATS}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Belum ada percakapan</Text>
        }
      />
    </View>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  badgeSell: {
    backgroundColor: "#DCFCE7",
  },

  badgeRent: {
    backgroundColor: "#E0E7FF",
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#065F46",
  },

  property: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },

  lastMsg: {
    fontSize: 13,
    color: "#374151",
  },

  unread: {
    backgroundColor: "#2563EB",
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#9CA3AF",
  },
});
