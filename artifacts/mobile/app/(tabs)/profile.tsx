import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { t } from "@/constants/i18n";
import { useColors } from "@/hooks/useColors";
import { LanguageSelector } from "@/components/LanguageSelector";
import { OfflineBanner } from "@/components/OfflineBanner";

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  danger,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.rowIcon, { backgroundColor: danger ? "#FFEBEE" : colors.secondary }]}>
        <Feather name={icon as any} size={16} color={danger ? "#E53935" : colors.primary} />
      </View>
      <Text style={[styles.rowLabel, { color: danger ? "#E53935" : colors.foreground }]}>
        {label}
      </Text>
      {value && (
        <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>{value}</Text>
      )}
      {onPress && !danger && (
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      )}
    </TouchableOpacity>
  );
}

const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  farmer: "Farmer",
  enthusiast: "Enthusiast",
};

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, language, signOut, isOffline } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleSignOut = () => {
    if (Platform.OS === "web") {
      signOut();
      router.replace("/(auth)/signin");
      return;
    }
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/(auth)/signin");
          },
        },
      ]
    );
  };

  const initials = user
    ? `${user.firstName.charAt(0)}${user.surname.charAt(0)}`.toUpperCase()
    : "?";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <OfflineBanner />
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          {t(language, "profile")}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.foreground }]}>
              {user ? `${user.firstName} ${user.surname}` : "Guest"}
            </Text>
            {user?.email && (
              <Text style={[styles.profileEmail, { color: colors.mutedForeground }]}>
                {user.email}
              </Text>
            )}
            <Text style={[styles.profilePhone, { color: colors.mutedForeground }]}>
              {user ? `${user.countryCode} ${user.phone}` : ""}
            </Text>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.roleText, { color: colors.primary }]}>
              {user ? ROLE_LABELS[user.role] : ""}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
            Preferences
          </Text>
          <View style={styles.languagePicker}>
            <View style={[styles.rowIcon, { backgroundColor: colors.secondary }]}>
              <Feather name="globe" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.foreground }]}>
              {t(language, "language")}
            </Text>
            <View style={{ flex: 1 }} />
            <LanguageSelector />
          </View>
          <SettingsRow
            icon="bell"
            label={t(language, "notifications")}
            onPress={() => {}}
          />
          <SettingsRow
            icon="shield"
            label={t(language, "privacy")}
            onPress={() => {}}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
            Account
          </Text>
          <SettingsRow icon="edit-2" label="Edit Profile" onPress={() => {}} />
          <SettingsRow icon="lock" label="Change Password" onPress={() => {}} />
          <SettingsRow icon="credit-card" label="Subscription Plan" value="Free" onPress={() => {}} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
            Support
          </Text>
          <SettingsRow icon="help-circle" label={t(language, "helpSupport")} onPress={() => {}} />
          <SettingsRow icon="info" label="About GreenedIn" onPress={() => {}} />
          <SettingsRow icon="star" label="Rate the App" onPress={() => {}} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingsRow
            icon="log-out"
            label={t(language, "signOut")}
            onPress={handleSignOut}
            danger
          />
        </View>

        {isOffline && (
          <View style={[styles.offlineCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Feather name="wifi-off" size={16} color={colors.mutedForeground} />
            <Text style={[styles.offlineText, { color: colors.mutedForeground }]}>
              Offline mode active — some features limited
            </Text>
          </View>
        )}

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          GreenedIn v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 22,
    fontFamily: "Lora_700Bold",
  },
  content: {
    padding: 16,
    gap: 12,
  },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    fontFamily: "Geist_700Bold",
    color: "#FFFFFF",
  },
  profileInfo: { flex: 1, gap: 2 },
  profileName: {
    fontSize: 17,
    fontFamily: "Geist_600SemiBold",
  },
  profileEmail: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
  },
  profilePhone: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
  },
  roleBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  roleText: {
    fontSize: 11,
    fontFamily: "Geist_600SemiBold",
  },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Geist_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Geist_400Regular",
  },
  rowValue: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
    marginRight: 4,
  },
  languagePicker: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  offlineCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  offlineText: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
    flex: 1,
  },
  version: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
    textAlign: "center",
    paddingTop: 4,
  },
});
