import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useApp } from "@/context/AppContext";
import type { Language } from "@/constants/i18n";
import { LANGUAGE_LABELS } from "@/constants/i18n";
import { useColors } from "@/hooks/useColors";

const LANGUAGES: Language[] = ["en", "fr", "ha", "yo", "ig", "ar"];

export function LanguageSelector() {
  const colors = useColors();
  const { language, setLanguage } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.trigger,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Feather name="globe" size={16} color={colors.primary} />
        <Text style={[styles.triggerText, { color: colors.foreground }]}>
          {LANGUAGE_LABELS[language]}
        </Text>
        <Feather name="chevron-down" size={16} color={colors.mutedForeground} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        />
        <View style={[styles.menu, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.menuTitle, { color: colors.foreground }]}>Select Language</Text>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.item,
                lang === language && { backgroundColor: colors.secondary },
              ]}
              onPress={() => {
                setLanguage(lang);
                setOpen(false);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.itemText,
                  { color: lang === language ? colors.primary : colors.foreground },
                ]}
              >
                {LANGUAGE_LABELS[lang]}
              </Text>
              {lang === language && (
                <Feather name="check" size={16} color={colors.accent} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  triggerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Geist_400Regular",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 8,
    paddingBottom: 32,
  },
  menuTitle: {
    fontSize: 14,
    fontFamily: "Geist_600SemiBold",
    textAlign: "center",
    paddingVertical: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 15,
    fontFamily: "Geist_400Regular",
  },
});
