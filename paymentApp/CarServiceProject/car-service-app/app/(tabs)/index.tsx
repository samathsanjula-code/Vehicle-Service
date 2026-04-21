import { useEffect } from "react";
import { router } from "expo-router";

export default function HomeScreen() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/(tabs)/payments");
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  return null;
}