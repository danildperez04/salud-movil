import type { IconKey } from "./icons";

export type ShowcaseTabKey =
  | "citas"
  | "medicamentos"
  | "indicadores"
  | "expediente";

export const showcaseTabs: {
  key: ShowcaseTabKey;
  label: string;
  icon: IconKey;
}[] = [
  { key: "citas", label: "Citas", icon: "citas" },
  { key: "medicamentos", label: "Medicamentos", icon: "medicamentos" },
  { key: "indicadores", label: "Indicadores", icon: "indicadores" },
  { key: "expediente", label: "Expediente", icon: "expediente" },
];

export const showcaseScreens: Record<
  ShowcaseTabKey,
  {
    num: string;
    title: string;
    text: string;
    list: string[];
    main: string;
    secondary: string;
  }
> = {
  citas: {
    num: "01 · CITAS",
    title: "Tus citas, bajo control.",
    text: "Consulta próximas citas, revisa tu historial y agenda nuevas atenciones desde una experiencia clara y sencilla.",
    list: ["Próximas citas", "Historial", "Agendar nueva cita"],
    main: "/assets/mockups/citas-tab-main.webp",
    secondary: "/assets/mockups/citas-tab-secondary.webp",
  },
  medicamentos: {
    num: "02 · MEDICAMENTOS",
    title: "Tus medicamentos, más organizados.",
    text: "Registra medicamentos, revisa horarios y configura recordatorios para facilitar el seguimiento de tus tratamientos.",
    list: ["Lista de medicamentos", "Horarios", "Recordatorios"],
    main: "/assets/mockups/medicamentos-tab-main.webp",
    secondary: "/assets/mockups/medicamentos-tab-secondary.webp",
  },
  indicadores: {
    num: "03 · INDICADORES",
    title: "Entiende mejor tu evolución.",
    text: "Registra indicadores de salud y consulta rangos visuales e historial de mediciones desde la misma aplicación.",
    list: [
      "Registro de indicadores",
      "Rangos visuales",
      "Historial y evolución",
    ],
    main: "/assets/mockups/indicadores-tab-main.webp",
    secondary: "/assets/mockups/indicadores-tab-secondary.webp",
  },
  expediente: {
    num: "04 · EXPEDIENTE",
    title: "Tu información clínica, en un solo lugar.",
    text: "Organiza diagnósticos, antecedentes, alergias, laboratorios, recetas, estudios y otros documentos importantes.",
    list: ["Resumen clínico", "Documentos", "Antecedentes y alergias"],
    main: "/assets/mockups/expediente-tab-main.webp",
    secondary: "/assets/mockups/expediente-tab-secondary.webp",
  },
};
