import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function GuestLayout() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 0.5,
          borderTopColor: "#E5E7EB",
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* 🏠 Halaman utama */}
      <Tabs.Screen
        name="homeGuest"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 👤 Profil / Harus login */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          // 🚪 jika user belum login, intercept tab press → arahkan ke login
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                if (!user) {
                  router.push("/auth/login");
                } else {
                  router.push("/(tabsGuest)/profile");
                }
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
