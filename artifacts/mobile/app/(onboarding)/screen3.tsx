import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { t } from "@/constants/i18n";

const { width, height } = Dimensions.get("window");

export default function Onboarding3() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, setHasOnboarded } = useApp();

  const handleGetStarted = async () => {
    await setHasOnboarded(true);
    router.replace("/(auth)/signup");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/onboarding3.jpg")}
        style={styles.bg}
        resizeMode="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(10,28,10,0.55)", "rgba(10,28,10,0.92)"]}
        style={styles.gradient}
        locations={[0.35, 0.65, 1]}
      />

      <View style={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
        <Text style={styles.title}>{t(language, "onboarding3Title")}</Text>
        <Text style={styles.subtitle}>{t(language, "onboarding3Subtitle")}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>{t(language, "getStarted")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: {
    position: "absolute",
    width,
    height,
    top: 0,
    left: 0,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    gap: 14,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  dotActive: {
    width: 22,
    backgroundColor: "#5CB840",
  },
  title: {
    fontSize: 32,
    fontFamily: "Lora_700Bold",
    color: "#FFFFFF",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Geist_400Regular",
    color: "rgba(255,255,255,0.78)",
    lineHeight: 23,
  },
  button: {
    backgroundColor: "#5CB840",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Geist_600SemiBold",
    color: "#FFFFFF",
  },
});
