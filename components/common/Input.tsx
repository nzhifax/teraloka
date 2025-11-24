import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  containerStyle?: ViewStyle; // ✅ Tambahkan properti ini agar bisa dikustom dari luar
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  isPassword = false,
  style,
  containerStyle,
  ...props
}) => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.inputBackground || theme.surfaceLight,
            borderColor: error ? theme.error : theme.border,
            shadowColor: theme.shadow,
          },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={theme.textSecondary}
            style={styles.icon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
            },
            style,
          ]}
          placeholderTextColor={theme.textSecondary}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={[styles.error, { color: theme.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.2,
    paddingHorizontal: 12,
    minHeight: 50,
    backgroundColor: "#F9FAFB",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 6,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  footerText: {
  fontSize: 14,
  color: "#6B7280",
},

footerLink: {
  fontSize: 14,
  fontWeight: "600",
  marginLeft: 4,
},

});
