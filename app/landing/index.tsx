import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";

export default function LandingPage() {
  const { theme } = useTheme();
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Floating loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      router.replace("/(tabsGuest)/homeGuest");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[
        "#0F172A",          // deep navy (kontras atas)
        theme.primary,      // brand color
        theme.background,   // bawah
      ]}
      locations={[0, 0.55, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: floatAnim }],
          },
        ]}
      >
        {/* Glow logo */}
        <LinearGradient
          colors={[
            theme.primary + "66",
            theme.primary + "00",
          ]}
          style={styles.logoGlow}
        />

        <Ionicons
          name="home-outline"
          size={70}
          color="#FFFFFF"
          style={styles.logo}
        />

        <Text style={styles.title}>Teraloka</Text>

        <Text style={styles.subtitle}>
          Temukan & Sewakan Properti dengan Mudah
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logoGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
  },

  logo: {
    marginBottom: 14,
  },

  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    color: "#E5E7EB",
    opacity: 0.9,
  },
});
