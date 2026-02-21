export function useAppFonts(): boolean {
  // Web build currently serves as PWA and should not depend on runtime
  // loading of local TTF assets from node_modules.
  return true;
}
