import AsyncStorage from "@react-native-async-storage/async-storage";

const INTRO_SEEN_KEY = "intro_seen_v1";

export async function isIntroSeen(): Promise<boolean> {
  const value = await AsyncStorage.getItem(INTRO_SEEN_KEY);
  return value === "1";
}

export async function markIntroSeen(): Promise<void> {
  await AsyncStorage.setItem(INTRO_SEEN_KEY, "1");
}
