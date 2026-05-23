import { Redirect } from "expo-router";

import { useApp } from "@/context/AppContext";

export default function Index() {
  const { user, hasOnboarded } = useApp();

  if (user) {
    return <Redirect href="/(tabs)" />;
  }
  if (hasOnboarded) {
    return <Redirect href="/(auth)/signin" />;
  }
  return <Redirect href="/splash" />;
}
