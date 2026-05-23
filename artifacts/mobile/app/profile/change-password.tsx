import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import { useColors } from "@/hooks/useColors";

export default function ChangePasswordScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { changePassword } = useApp();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isValid = current && next && confirm && next.length >= 6 && next === confirm;

  const handleChange = async () => {
    if (!isValid) return;
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (next.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    setError("");
    setSaving(true);
    const result = await changePassword(current, next);
    setSaving(false);
    if (!result.success) {
      setError(result.error || "Failed to change password.");
    } else {
      setSuccess(true);
      setCurrent(""); setNext(""); setConfirm("");
      if (Platform.OS !== "web") {
        Alert.alert("Success", "Your password has been changed.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    }
  };

  const topPad = Platform.OS === "web" ? 0 : insets.top;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Change Password</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.iconCircle, { backgroundColor: colors.secondary }]}>
          <Feather name="lock" size={28} color={colors.primary} />
        </View>
        <Text style={[styles.desc, { color: colors.mutedForeground }]}>
          Choose a strong password of at least 6 characters. You will need it each time you sign in.
        </Text>

        {[
          { label: "Current Password", value: current, set: setCurrent, show: showCurrent, toggleShow: () => setShowCurrent((v) => !v), key: "c" },
          { label: "New Password", value: next, set: setNext, show: showNext, toggleShow: () => setShowNext((v) => !v), key: "n" },
          { label: "Confirm New Password", value: confirm, set: setConfirm, show: showNext, toggleShow: () => setShowNext((v) => !v), key: "cf" },
        ].map((f) => (
          <View key={f.key} style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>{f.label}</Text>
            <View style={[styles.passRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput
                style={[styles.passInput, { color: colors.foreground }]}
                value={f.value}
                onChangeText={f.set}
                placeholder={f.key === "c" ? "Current password" : f.key === "n" ? "At least 6 characters" : "Repeat new password"}
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!f.show}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={f.toggleShow} style={styles.eyeBtn}>
                <Feather name={f.show ? "eye-off" : "eye"} size={18} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {confirm && next !== confirm && (
          <Text style={styles.mismatch}>Passwords do not match</Text>
        )}

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: "#FFF0F0", borderColor: "#FFCCCC" }]}>
            <Feather name="alert-circle" size={14} color="#E53935" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {success ? (
          <View style={[styles.successBox, { backgroundColor: "#EBF7E6", borderColor: "#5CB840" }]}>
            <Feather name="check-circle" size={14} color="#5CB840" />
            <Text style={[styles.successText, { color: "#2A5129" }]}>Password changed successfully.</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: isValid ? colors.primary : colors.muted }]}
          onPress={handleChange}
          disabled={!isValid || saving}
          activeOpacity={0.85}
        >
          <Text style={[styles.submitText, { color: isValid ? colors.primaryForeground : colors.mutedForeground }]}>
            {saving ? "Changing..." : "Change Password"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Lora_600SemiBold",
  },
  content: {
    padding: 24,
    gap: 16,
    alignItems: "stretch",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    fontFamily: "Geist_400Regular",
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 8,
  },
  field: { gap: 7 },
  label: {
    fontSize: 13,
    fontFamily: "Geist_500Medium",
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
    paddingVertical: 13,
    fontSize: 15,
    fontFamily: "Geist_400Regular",
  },
  eyeBtn: { paddingHorizontal: 14 },
  mismatch: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
    color: "#E53935",
    marginTop: -8,
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
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  successText: {
    fontSize: 13,
    fontFamily: "Geist_500Medium",
    flex: 1,
  },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: {
    fontSize: 16,
    fontFamily: "Geist_600SemiBold",
  },
});
