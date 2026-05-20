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

import { useApp } from "@/context/AppContext";
import type { UserRole } from "@/context/AppContext";
import { t } from "@/constants/i18n";
import { useColors } from "@/hooks/useColors";

const COUNTRY_CODES = [
  { code: "+234", country: "Nigeria" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+33", country: "France" },
  { code: "+27", country: "South Africa" },
  { code: "+254", country: "Kenya" },
  { code: "+233", country: "Ghana" },
  { code: "+221", country: "Senegal" },
  { code: "+225", country: "Ivory Coast" },
  { code: "+971", country: "UAE" },
];

const ROLES: { key: UserRole; label: string }[] = [
  { key: "student", label: "Student" },
  { key: "farmer", label: "Farmer" },
  { key: "enthusiast", label: "Enthusiast" },
];

export default function SignUp() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, setUser } = useApp();

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [role, setRole] = useState<UserRole>("farmer");
  const [showPass, setShowPass] = useState(false);
  const [showCodePicker, setShowCodePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = firstName && surname && phone && password;

  const handleCreate = async () => {
    if (!isValid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    await setUser({
      id: Date.now().toString(),
      firstName: firstName.trim(),
      surname: surname.trim(),
      phone,
      countryCode,
      email: email.trim() || undefined,
      role,
    });
    router.replace("/(tabs)/");
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
            paddingTop: Platform.OS === "web" ? 80 : insets.top + 32,
            paddingBottom: insets.bottom + 40,
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
          Join GreenedIn
        </Text>
        <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
          Your agricultural journey starts here
        </Text>

        <View style={styles.form}>
          <View style={styles.row2}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                {t(language, "firstName")}
              </Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                placeholderTextColor={colors.mutedForeground}
                returnKeyType="next"
                autoCapitalize="words"
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                {t(language, "surname")}
              </Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
                value={surname}
                onChangeText={setSurname}
                placeholder="Surname"
                placeholderTextColor={colors.mutedForeground}
                returnKeyType="next"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              {t(language, "phoneNumber")}
            </Text>
            <View style={[styles.phoneRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TouchableOpacity
                style={styles.countryCode}
                onPress={() => setShowCodePicker(true)}
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
              {t(language, "emailOptional")}
            </Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              {t(language, "password")}
            </Text>
            <View style={[styles.passRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput
                style={[styles.passInput, { color: colors.foreground }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showPass}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={() => setShowPass((p) => !p)} style={styles.eyeBtn}>
                <Feather name={showPass ? "eye-off" : "eye"} size={18} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              {t(language, "iAm")}
            </Text>
            <View style={styles.roleRow}>
              {ROLES.map((r) => (
                <TouchableOpacity
                  key={r.key}
                  style={[
                    styles.roleBtn,
                    {
                      backgroundColor: role === r.key ? colors.primary : colors.card,
                      borderColor: role === r.key ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setRole(r.key)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.roleBtnText,
                      { color: role === r.key ? colors.primaryForeground : colors.foreground },
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitBtn,
              { backgroundColor: !isValid ? colors.muted : colors.primary },
            ]}
            onPress={handleCreate}
            disabled={!isValid || loading}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.submitText,
                { color: !isValid ? colors.mutedForeground : colors.primaryForeground },
              ]}
            >
              {loading ? "Creating account..." : t(language, "createAccount")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/(auth)/signin")}>
            <Text style={[styles.switchText, { color: colors.mutedForeground }]}>
              {t(language, "alreadyHaveAccount")}
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
    width: 140,
    height: 60,
    marginBottom: 16,
  },
  heading: {
    fontSize: 26,
    fontFamily: "Lora_700Bold",
    textAlign: "center",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
    textAlign: "center",
    marginBottom: 28,
  },
  form: {
    width: "100%",
    gap: 16,
  },
  row2: {
    flexDirection: "row",
    gap: 10,
  },
  field: { gap: 7 },
  label: {
    fontSize: 13,
    fontFamily: "Geist_500Medium",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Geist_400Regular",
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
    paddingVertical: 13,
    gap: 4,
  },
  countryCodeText: {
    fontSize: 14,
    fontFamily: "Geist_500Medium",
  },
  divider: {
    width: 1,
    height: 22,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 13,
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
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Geist_400Regular",
  },
  eyeBtn: { paddingHorizontal: 14 },
  roleRow: {
    flexDirection: "row",
    gap: 8,
  },
  roleBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  roleBtnText: {
    fontSize: 13,
    fontFamily: "Geist_500Medium",
  },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 6,
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
