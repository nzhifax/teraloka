export const lightTheme = {
  // Primary brand color (professional blue)
  primary: "#1E88E5",
  primaryDark: "#1565C0",
  primaryLight: "#64B5F6",

  // Base background colors
  background: "#FFFFFF",
  surface: "#F5F7FA",
  surfaceLight: "#FAFBFC",
  card: "#FFFFFF",

  // Text colors
  text: "#0D1B2A",
  textSecondary: "#4B5563",
  textLight: "#9CA3AF",

  // Borders & visual separators
  border: "#E5E7EB",

  // Semantic colors
  error: "#E53935",
  success: "#2E7D32",
  warning: "#F9A825",
  info: "#1E88E5",

  // UI components
  inputBackground: "#EEF2F5",
  shadow: "rgba(0, 0, 0, 0.08)",
};

export const darkTheme = {
  // Primary brand color (still blue, but lighter for dark background)
  primary: "#64B5F6",
  primaryDark: "#2196F3",
  primaryLight: "#90CAF9",

  // Background layers
  background: "#0A1929",
  surface: "#102A43",
  surfaceLight: "#1E3A5F",
  card: "#112D4E",

  // Text and borders
  text: "#E3F2FD",
  textSecondary: "#9CA3AF",
  textLight: "#6B7280",
  border: "#1E3A5F",

  // Semantic colors
  error: "#EF5350",
  success: "#81C784",
  warning: "#FBC02D",
  info: "#64B5F6",

  // UI
  inputBackground: "#1A273D",
  shadow: "rgba(0, 0, 0, 0.4)",
};

export type Theme = typeof lightTheme;
