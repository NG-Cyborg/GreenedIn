import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import type { UserRole } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const ROLES: { key: UserRole; label: string }[] = [
  { key: "student", label: "Student" },
  { key: "farmer", label: "Farmer" },
  { key: "enthusiast", label: "Enthusiast" },
];

export default function EditProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, updateUser } = useApp();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [surname, setSurname] = useState(user?.surname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState<UserRole>(user?.role || "farmer");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!firstName.trim() || !surname.trim()) {
      Alert.alert("Error", "First name and surname are required.");
      return;
    }
    setSaving(true);
    await updateUser({
      firstName: firstName.trim(),
      surname: surname.trim(),
      email: email.trim() || undefined,
      role,
    });
    setSaving(false);
    if (Platform.OS !== "web") {
      Alert.alert("Saved", "Your profile has been updated.");
    }
    router.back();
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Edit Profile</Text>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={[styles.saveBtnText, { color: colors.primaryForeground }]}>
            {saving ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {(firstName.charAt(0) + surname.charAt(0)).toUpperCase() || "?"}
            </Text>
          </View>
        </View>

        {[
          { label: "First Name", value: firstName, set: setFirstName, placeholder: "First name", key: "fn" },
          { label: "Surname", value: surname, set: setSurname, placeholder: "Surname", key: "sn" },
          { label: "Email (Optional)", value: email, set: setEmail, placeholder: "email@example.com", key: "em", keyboard: "email-address" as const },
        ].map((f) => (
          <View key={f.key} style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>{f.label}</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
              value={f.value}
              onChangeText={f.set}
              placeholder={f.placeholder}
              placeholderTextColor={colors.mutedForeground}
              keyboardType={f.keyboard || "default"}
              autoCapitalize={f.keyboard === "email-address" ? "none" : "words"}
            />
          </View>
        ))}

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground }]}>I am a</Text>
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
                <Text style={[styles.roleBtnText, { color: role === r.key ? colors.primaryForeground : colors.foreground }]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="info" size={14} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Phone number cannot be changed. Contact support if you need to update your phone number.
          </Text>
        </View>
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
    flex: 1,
    fontSize: 17,
    fontFamily: "Lora_600SemiBold",
  },
  saveBtn: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: "Geist_600SemiBold",
  },
  content: {
    padding: 20,
    gap: 18,
  },
  avatarRow: {
    alignItems: "center",
    paddingVertical: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 28,
    fontFamily: "Geist_700Bold",
    color: "#FFFFFF",
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
    paddingVertical: 13,
    fontSize: 15,
    fontFamily: "Geist_400Regular",
  },
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
  infoBox: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Geist_400Regular",
    lineHeight: 18,
  },
});
