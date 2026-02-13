export const tokens = {
  color: {
    bg: "#F5F2EE",
    surface: "#F7F4F1",
    text: "#5E6268",
    textFaint: "#A9B2B4",
    textGhost: "#C5CCCA",
    accent: "#8FAFB1",
    overlay: "rgba(76, 78, 80, 0.26)",
    border: "#E8E4DE",
    buttonBg: "#EDE9E3",
    buttonBgHover: "#E7E2DB",
  },
  radius: {
    card: 28,
    button: 18,
    sheet: 28,
    pill: 999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    hero: 46,
    body: 19,
    meta: 12,
    title: 22,
  },
  motion: {
    holdMs: 750,
    releaseFadeMs: 450,
    releasedStateMs: 3000,
  },
} as const;
