import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useApp } from "@/context/AppContext";
import { t } from "@/constants/i18n";
import { useColors } from "@/hooks/useColors";

const COUNTRY_CODES = [
  { code: "+234", country: "NG" },
  { code: "+1", country: "US" },
  { code: "+44", country: "GB" },
  { code: "+33", country: "FR" },
  { code: "+27", country: "ZA" },
  { code: "+254", country: "KE" },
  { code: "+233", country: "GH" },
];

export default function SignIn() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, setUser, validateCredentials } = useApp();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [showPass, setShowPass] = useState(false);
  const [showCodePicker, setShowCodePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!phone || !password) return;
    setLoading(true);
    setError("");

    const userId = await validateCredentials(phone, countryCode, password);
    if (!userId) {
      setError("Incorrect phone number or password. Please try again.");
      setLoading(false);
      return;
    }

    const storedUser = await AsyncStorage.getItem("@greenedin_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.id === userId) {
        await setUser(parsed);
        router.replace("/(tabs)");
        setLoading(false);
        return;
      }
    }

    setError("Account not found. Please sign up first.");
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Platform.OS === "web" ? 80 : insets.top + 40,
            paddingBottom: insets.bottom + 32,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={[styles.heading, { color: colors.foreground }]}>
          Welcome back
        </Text>
        <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
          Sign in to continue farming smarter
        </Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              {t(language, "phoneNumber")}
            </Text>
            <View style={[styles.phoneRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TouchableOpacity
                style={styles.countryCode}
                onPress={() => setShowCodePicker((v) => !v)}
              >
                <Text style={[styles.countryCodeText, { color: colors.foreground }]}>
                  {countryCode}
                </Text>
                <Feather name="chevron-down" size={14} color={colors.mutedForeground} />
              </TouchableOpacity>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <TextInput
                style={[styles.phoneInput, { color: colors.foreground }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="800 000 0000"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>
          </View>

          {showCodePicker && (
            <View style={[styles.codePicker, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {COUNTRY_CODES.map((c) => (
                <TouchableOpacity
                  key={c.code}
                  style={styles.codeItem}
                  onPress={() => { setCountryCode(c.code); setShowCodePicker(false); }}
                >
                  <Text style={[styles.codeText, { color: colors.foreground }]}>
                    {c.code} — {c.country}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              {t(language, "password")}
            </Text>
            <View style={[styles.passRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput
                style={[styles.passInput, { color: colors.foreground }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showPass}
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
              />
              <TouchableOpacity onPress={() => setShowPass((p) => !p)} style={styles.eyeBtn}>
                <Feather name={showPass ? "eye-off" : "eye"} size={18} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          </View>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: "#FFF0F0", borderColor: "#FFCCCC" }]}>
              <Feather name="alert-circle" size={14} color="#E53935" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              styles.submitBtn,
              { backgroundColor: !phone || !password ? colors.muted : colors.primary },
            ]}
            onPress={handleSignIn}
            disabled={!phone || !password || loading}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.submitText,
                { color: !phone || !password ? colors.mutedForeground : colors.primaryForeground },
              ]}
            >
              {loading ? "Signing in..." : t(language, "signIn")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/(auth)/signup")}>
            <Text style={[styles.switchText, { color: colors.mutedForeground }]}>
              {t(language, "noAccount")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: 28,
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 70,
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontFamily: "Lora_700Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    fontFamily: "Geist_400Regular",
    textAlign: "center",
    marginBottom: 36,
  },
  form: {
    width: "100%",
    gap: 18,
  },
  field: { gap: 8 },
  label: {
    fontSize: 13,
    fontFamily: "Geist_500Medium",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 4,
  },
  countryCodeText: {
    fontSize: 14,
    fontFamily: "Geist_500Medium",
  },
  divider: {
    width: 1,
    height: 24,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Geist_400Regular",
  },
  codePicker: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  codeItem: {
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  codeText: {
    fontSize: 14,
    fontFamily: "Geist_400Regular",
  },
  passRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  passInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Geist_400Regular",
  },
  eyeBtn: {
    paddingHorizontal: 14,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    color: "#E53935",
    fontSize: 13,
    fontFamily: "Geist_400Regular",
    flex: 1,
  },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: {
    fontSize: 16,
    fontFamily: "Geist_600SemiBold",
  },
  switchText: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Geist_400Regular",
  },
});
