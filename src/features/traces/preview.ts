export function getPreview(text: string): string {
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact) return "";
  const words = compact.split(" ");
  if (words.length <= 7) return compact;
  return `${words.slice(0, 7).join(" ")}...`;
}
