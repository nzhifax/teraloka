import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function LandingPage() {
  const { theme } = useTheme();
  const router = useRouter();

  // 🔥 Animasi fade-in
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Mulai animasi fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900, // 0.9 detik
      useNativeDriver: true,
    }).start();

    // ⏳ Setelah 2 detik → pindah ke guest
    const timer = setTimeout(() => {
      router.replace("/(tabsGuest)/homeGuest");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.background, opacity: fadeAnim },
      ]}
    >
      <Ionicons name="home-outline" size={60} color={theme.primary} />

      <Text style={[styles.title, { color: theme.primary }]}>Teraloka</Text>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Temukan & Sewakan Properti dengan Mudah
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 6,
  },
});
