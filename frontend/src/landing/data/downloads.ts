import type { ReleasePlatform } from "../../types";

// Copy de las tarjetas de descarga. Las versiones y los archivos salen de la
// API (`GET /releases/latest`); aquí solo vive el texto que no cambia.
export const downloadPlatforms: {
  platform: ReleasePlatform | "ios";
  name: string;
  description: string;
  cta: string;
}[] = [
  {
    platform: "android",
    name: "Android",
    description:
      "Instala Salud Móvil en tu teléfono Android y lleva el seguimiento de tu salud siempre contigo.",
    cta: "Descargar para Android",
  },
  {
    platform: "windows",
    name: "Windows",
    description:
      "Usa Salud Móvil desde tu computadora con Windows 10 u 11.",
    cta: "Descargar para Windows",
  },
  {
    platform: "macos",
    name: "macOS",
    description: "Instala Salud Móvil en tu Mac.",
    cta: "Descargar para macOS",
  },
  {
    platform: "ios",
    name: "iOS",
    description: "Estamos preparando la experiencia de Salud Móvil para iPhone.",
    cta: "",
  },
];
