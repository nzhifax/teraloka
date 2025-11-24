import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import "../utils/i18n";

import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { ProductProvider } from "../contexts/ProductContext";
import { LandProvider } from "../contexts/LandContext";
import { StatsProvider } from "../contexts/StatsContext";
import { ActivityProvider } from "../contexts/ActivityContext";

// GATE UNTUK MENGATUR ARAH USER
function AuthGate() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  // GUEST
  if (!user) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabsGuest)" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
      </Stack>
    );
  }

  // OWNER
  if (user.userType === "owner") {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabsOwner)" />
      </Stack>
    );
  }

  // BUYER
  if (user.userType === "buyer") {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabsBuyer)" />
      </Stack>
    );
  }

  // ADMIN
  if (user.userType === "admin") {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabsAdmin)" />
      </Stack>
    );
  }

  return null;
}

export default function RootLayout() {
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLanding(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <LandProvider>
          <CartProvider>
            <ProductProvider>
              <StatsProvider>
                <ActivityProvider>

                  {showLanding ? (
                    // TAMPILKAN LANDING DULU
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="landing/index" />
                    </Stack>
                  ) : (
                    // BARU AUTHGATE SETELAH LANDING SELESAI
                    <AuthGate />
                  )}

                </ActivityProvider>
              </StatsProvider>
            </ProductProvider>
          </CartProvider>
        </LandProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
