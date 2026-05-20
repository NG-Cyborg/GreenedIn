import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useApp } from "@/context/AppContext";
import { useEnterprise } from "@/context/EnterpriseContext";
import type { EnterpriseType } from "@/context/EnterpriseContext";
import { t } from "@/constants/i18n";
import { useColors } from "@/hooks/useColors";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
};

export function AddEnterpriseModal({ visible, onClose, onCreated }: Props) {
  const colors = useColors();
  const { language } = useApp();
  const { addEnterprise } = useEnterprise();

  const [name, setName] = useState("");
  const [type, setType] = useState<EnterpriseType | "">("");
  const [numberOfUnits, setNumberOfUnits] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName("");
    setType("");
    setNumberOfUnits("");
    setFarmSize("");
  };

  const handleCreate = async () => {
    if (!name.trim() || !type || !numberOfUnits) return;
    setLoading(true);
    try {
      const e = await addEnterprise({
        name: name.trim(),
        type: type as EnterpriseType,
        numberOfUnits: parseInt(numberOfUnits, 10) || 0,
        farmSize: type === "crop" ? parseFloat(farmSize) || undefined : undefined,
      });
      reset();
      onCreated(e.id);
    } finally {
      setLoading(false);
    }
  };

  const types: { key: EnterpriseType; label: string }[] = [
    { key: "poultry", label: t(language, "poultry") },
    { key: "crop", label: t(language, "cropFarming") },
    { key: "livestock", label: t(language, "livestock") },
  ];

  const unitsLabel =
    type === "poultry"
      ? t(language, "numberOfBirds")
      : type === "livestock"
      ? t(language, "numberOfAnimals")
      : t(language, "numberOfStands");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {t(language, "createEnterprise")}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.foreground }]}>
                  {t(language, "enterpriseName")}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Layer Farm 2025"
                  placeholderTextColor={colors.mutedForeground}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.foreground }]}>
                  {t(language, "enterpriseType")}
                </Text>
                <View style={styles.typeRow}>
                  {types.map((tp) => (
                    <TouchableOpacity
                      key={tp.key}
                      style={[
                        styles.typeBtn,
                        {
                          backgroundColor:
                            type === tp.key ? colors.primary : colors.card,
                          borderColor:
                            type === tp.key ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => setType(tp.key)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.typeBtnText,
                          {
                            color:
                              type === tp.key
                                ? colors.primaryForeground
                                : colors.foreground,
                          },
                        ]}
                      >
                        {tp.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {type !== "" && (
                <>
                  {type === "crop" && (
                    <View style={styles.field}>
                      <Text style={[styles.label, { color: colors.foreground }]}>
                        {t(language, "farmSize")}
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            color: colors.foreground,
                          },
                        ]}
                        value={farmSize}
                        onChangeText={setFarmSize}
                        placeholder="e.g. 2.5"
                        placeholderTextColor={colors.mutedForeground}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  )}

                  <View style={styles.field}>
                    <Text style={[styles.label, { color: colors.foreground }]}>
                      {unitsLabel}
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                          color: colors.foreground,
                        },
                      ]}
                      value={numberOfUnits}
                      onChangeText={setNumberOfUnits}
                      placeholder="e.g. 500"
                      placeholderTextColor={colors.mutedForeground}
                      keyboardType="number-pad"
                    />
                  </View>
                </>
              )}

              <TouchableOpacity
                style={[
                  styles.createBtn,
                  {
                    backgroundColor:
                      !name || !type || !numberOfUnits
                        ? colors.muted
                        : colors.primary,
                  },
                ]}
                onPress={handleCreate}
                disabled={!name || !type || !numberOfUnits || loading}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.createBtnText,
                    {
                      color:
                        !name || !type || !numberOfUnits
                          ? colors.mutedForeground
                          : colors.primaryForeground,
                    },
                  ]}
                >
                  {loading ? "Creating..." : t(language, "create")}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  keyboardView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: "85%",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Lora_600SemiBold",
  },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 18,
  },
  field: {
    gap: 8,
  },
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
  typeRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  typeBtnText: {
    fontSize: 12,
    fontFamily: "Geist_500Medium",
  },
  createBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  createBtnText: {
    fontSize: 16,
    fontFamily: "Geist_600SemiBold",
  },
});
