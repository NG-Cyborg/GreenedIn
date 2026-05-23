import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from "react-native";

import { useApp } from "@/context/AppContext";

const { height } = Dimensions.get("window");

export default function SplashScreen() {
  const { user, hasOnboarded } = useApp();
  const router = useRouter();

  const logoTranslateY = useRef(new Animated.Value(-height * 0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const leafTranslateY = useRef(new Animated.Value(-80)).current;
  const leafOpacity = useRef(new Animated.Value(0)).current;
  const leafRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(logoTranslateY, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(leafTranslateY, {
          toValue: 0,
          tension: 20,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(leafOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(leafRotate, {
            toValue: 15,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(leafRotate, {
            toValue: -8,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(leafRotate, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      if (user) {
        router.replace("/(tabs)");
      } else if (hasOnboarded) {
        router.replace("/(auth)/signin");
      } else {
        router.replace("/(onboarding)");
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const leafSpin = leafRotate.interpolate({
    inputRange: [-30, 30],
    outputRange: ["-30deg", "30deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: logoOpacity,
            transform: [{ translateY: logoTranslateY }],
          },
        ]}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.leafWrapper,
          {
            opacity: leafOpacity,
            transform: [
              { translateY: leafTranslateY },
              { rotate: leafSpin },
            ],
          },
        ]}
      >
        <View style={styles.leaf} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF5",
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 220,
    height: 100,
  },
  leafWrapper: {
    position: "absolute",
    top: "47%",
    right: "28%",
  },
  leaf: {
    width: 10,
    height: 10,
    backgroundColor: "#5CB840",
    borderRadius: 5,
  },
});
