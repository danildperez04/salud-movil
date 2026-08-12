// lib/theme.ts
// Espejo en TS de los tokens de tailwind.config.js, para usar en lugares
// donde no aplican clases (StyleSheet.create, gráficos, SVG, splash screen, etc)

export const colors = {
  primary: "#0E2A3A",
  primaryLight: "#2DB79A",

  brandBlue: "#0E2A3A",
  brandGreen: "#2DB79A",

  secondaryGreenLight: "#77D1B5",
  secondaryTeal: "#135E6D",
  secondarySteel: "#2D7F8E",

  neutralCarbon: "#1A2129",
  neutralMedium: "#6B7280",
  neutralLight: "#E5E7EB",
  neutralWhite: "#FFFFFF",

  backgroundDefault: "#FFFFFF",
  backgroundDark: "#0E2A3A",
  backgroundSubtle: "#E5E7EB",

  textDefault: "#1A2129",
  textInverted: "#FFFFFF",
  textMuted: "#6B7280",
  textAccent: "#2DB79A",

  borderDefault: "#E5E7EB",
  borderDark: "#135E6D",
} as const;

export const fonts = {
  heading: "Poppins_700Bold",
  headingSemibold: "Poppins_600SemiBold",
  headingMedium: "Poppins_500Medium",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemibold: "Inter_600SemiBold",
} as const;

export const fontSizes = {
  h1: 48,
  h2: 32,
  h3: 24,
  body: 16,
  small: 14,
  button: 16,
  caption: 12,
} as const;

export type ColorToken = keyof typeof colors;
