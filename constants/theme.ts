/**
 * Professional Blue Theme for the app
 * Supports both Light and Dark mode.
 */

import { Platform } from "react-native";

// Main color palette
const primaryBlue = "#1E88E5"; // Main blue (professional tone)
const lightBlue = "#90CAF9";   // Accent / hover
const darkBlue = "#1565C0";    // Darker variant for contrast
const gray = "#F5F7FA";        // Background gray for light mode

export const Colors = {
  light: {
    text: "#0D1B2A",             // Dark navy text for clarity
    textSecondary: "#4F5B62",    // Muted gray-blue text
    background: "#FFFFFF",       // Pure white background
    surface: gray,               // Card / surface background
    border: "#E0E0E0",           // Divider and border lines
    tint: primaryBlue,           // Button, link, or highlight color
    accent: lightBlue,           // For subtle highlights
    icon: "#5C6B73",             // Default icon color
    tabIconDefault: "#8E9AAF",
    tabIconSelected: primaryBlue,
    error: "#E53935",
  },

  dark: {
    text: "#E3F2FD",             // Very light blue text
    textSecondary: "#90A4AE",    // Muted secondary text
    background: "#0A1929",       // Deep navy background
    surface: "#102A43",          // Slightly lighter surface
    border: "#1E3A5F",
    tint: lightBlue,
    accent: "#64B5F6",
    icon: "#B0BEC5",
    tabIconDefault: "#78909C",
    tabIconSelected: lightBlue,
    error: "#EF5350",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
