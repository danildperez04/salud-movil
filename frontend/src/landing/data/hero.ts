import type { IconKey } from "./icons";

// Cada frase del titular se anima por separado; la última va en color de marca.
export const heroHeadline = {
  lines: ["Tu salud.", "Más clara.", "Más cerca."],
  accent: "Siempre contigo.",
};

export const heroPoints = [
  "Todo en un solo lugar",
  "Recordatorios útiles",
  "Información siempre disponible",
];

export type HeroFloatCardId = "cita" | "medicamentos" | "indicadores";

export const heroFloatCards: {
  id: HeroFloatCardId;
  icon: IconKey;
  title: string;
  text: string;
}[] = [
  {
    id: "cita",
    icon: "citas",
    title: "Próxima cita",
    text: "Organiza tus consultas.",
  },
  {
    id: "medicamentos",
    icon: "medicamentos",
    title: "Medicamentos",
    text: "Horarios y recordatorios.",
  },
  {
    id: "indicadores",
    icon: "indicadores",
    title: "Indicadores",
    text: "Visualiza tu evolución.",
  },
];

export const trustItems: { icon: IconKey; title: string; subtitle: string }[] =
  [
    { icon: "citas", title: "Citas", subtitle: "Agenda y seguimiento" },
    {
      icon: "medicamentos",
      title: "Medicamentos",
      subtitle: "Horarios y recordatorios",
    },
    {
      icon: "indicadores",
      title: "Indicadores",
      subtitle: "Registro y evolución",
    },
    {
      icon: "expediente",
      title: "Expediente",
      subtitle: "Tu información clínica",
    },
  ];
