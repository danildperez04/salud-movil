import type { IconKey } from "./icons";

export const problemCards: { icon: IconKey; title: string; text: string }[] = [
  {
    icon: "citas",
    title: "Fechas que se olvidan",
    text: "Organiza citas y recordatorios para tener una visión más clara de lo que viene.",
  },
  {
    icon: "medicamentos",
    title: "Medicamentos dispersos",
    text: "Centraliza información de medicamentos, horarios y recordatorios en un solo lugar.",
  },
  {
    icon: "indicadores",
    title: "Indicadores sin contexto",
    text: "Registra mediciones y consulta su historial para entender mejor su evolución.",
  },
  {
    icon: "documentos",
    title: "Documentos difíciles de encontrar",
    text: "Reúne diagnósticos, antecedentes, alergias, estudios y otros documentos clínicos.",
  },
];

export const features: {
  icon: IconKey;
  title: string;
  text: string;
  highlight?: boolean;
}[] = [
  {
    icon: "citas",
    title: "Citas médicas",
    text: "Agenda nuevas citas, consulta las próximas y revisa tu historial de atenciones.",
  },
  {
    icon: "medicamentos",
    title: "Medicamentos",
    text: "Registra medicamentos, horarios y recordatorios para facilitar el seguimiento de tus tratamientos.",
  },
  {
    icon: "indicadores",
    title: "Indicadores de salud",
    text: "Registra valores, consulta rangos visuales y revisa el historial de tus mediciones.",
  },
  {
    icon: "expediente",
    title: "Expediente clínico",
    text: "Organiza diagnósticos, antecedentes, alergias, laboratorios, recetas, estudios y notas.",
  },
  {
    icon: "prioridad",
    title: "IPCP · Mi prioridad",
    text: "Una herramienta de orientación que ayuda a visualizar el nivel de prioridad y cuándo conviene buscar atención.",
    highlight: true,
  },
  {
    icon: "recursos",
    title: "Recursos de salud",
    text: "Consulta establecimientos y herramientas de orientación para encontrar atención y servicios.",
  },
];

export const steps: {
  icon: IconKey;
  num: string;
  label: string;
  title: string;
  text: string;
}[] = [
  {
    icon: "perfil",
    num: "01",
    label: "CREA TU PERFIL",
    title: "Registra tu información",
    text: "Crea tu cuenta con tus datos básicos y configura la experiencia según tus necesidades.",
  },
  {
    icon: "organiza",
    num: "02",
    label: "ORGANIZA",
    title: "Centraliza tu salud",
    text: "Agrega citas, medicamentos, indicadores y documentos clínicos para tener todo más ordenado.",
  },
  {
    icon: "seguimiento",
    num: "03",
    label: "DA SEGUIMIENTO",
    title: "Consulta cuando lo necesites",
    text: "Revisa recordatorios, evolución e información relevante directamente desde tu celular.",
  },
];
