import { useFonts } from "expo-font";
import { Inter_300Light } from "@expo-google-fonts/inter";
import { LaBelleAurore_400Regular } from "@expo-google-fonts/la-belle-aurore";
import { Spectral_200ExtraLight_Italic } from "@expo-google-fonts/spectral";

export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    Inter_300Light,
    LaBelleAurore_400Regular,
    Spectral_200ExtraLight_Italic,
  });

  return loaded;
}
