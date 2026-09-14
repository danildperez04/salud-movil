// -----------------------------------------------------------------------
// Contenido de la landing de Salud Móvil.
// Mantener el copy aquí (en vez de embebido en JSX) facilita editarlo
// sin tocar la lógica de los componentes.
// -----------------------------------------------------------------------

// Fotos del equipo (Vite las procesa como assets con hash de caché)
import danildPhoto from "../../assets/Danild.jpeg";
import elivaPhoto from "../../assets/Eli.png";
import freddyPhoto from "../../assets/Freddy.jpeg";
import julioPhoto from "../../assets/jarey.jpeg";
import joshuaPhoto from "../../assets/Joshua.jpeg";
import groupPhoto from "../../assets/Grupo.jpeg";
import hackathonMemoryPhoto from "../../assets/grupo_Hk_2025.jpeg";

export const navLinks = [
  { href: "#beneficios", label: "Beneficios" },
  { href: "#funciones", label: "Funciones" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#descubre", label: "Conoce la app" },
  { href: "#sobre-nosotros", label: "Sobre nosotros" },
];

export const heroPoints = [
  "Todo en un solo lugar",
  "Recordatorios útiles",
  "Información siempre disponible",
];

export const heroFloatCards = [
  {
    icon: "◷",
    title: "Próxima cita",
    text: "Organiza tus consultas.",
    className: "fc1",
  },
  {
    icon: "✚",
    title: "Medicamentos",
    text: "Horarios y recordatorios.",
    className: "fc2",
  },
  {
    icon: "♡",
    title: "Indicadores",
    text: "Visualiza tu evolución.",
    className: "fc3",
  },
];

export const trustItems = [
  { title: "Citas", subtitle: "Agenda y seguimiento" },
  { title: "Medicamentos", subtitle: "Horarios y recordatorios" },
  { title: "Indicadores", subtitle: "Registro y evolución" },
  { title: "Expediente", subtitle: "Tu información clínica" },
];

export const problemCards = [
  {
    icon: "◷",
    title: "Fechas que se olvidan",
    text: "Organiza citas y recordatorios para tener una visión más clara de lo que viene.",
  },
  {
    icon: "✚",
    title: "Medicamentos dispersos",
    text: "Centraliza información de medicamentos, horarios y recordatorios en un solo lugar.",
  },
  {
    icon: "⌁",
    title: "Indicadores sin contexto",
    text: "Registra mediciones y consulta su historial para entender mejor su evolución.",
  },
  {
    icon: "▤",
    title: "Documentos difíciles de encontrar",
    text: "Reúne diagnósticos, antecedentes, alergias, estudios y otros documentos clínicos.",
  },
];

export const features = [
  {
    icon: "◷",
    title: "Citas médicas",
    text: "Agenda nuevas citas, consulta las próximas y revisa tu historial de atenciones.",
  },
  {
    icon: "✚",
    title: "Medicamentos",
    text: "Registra medicamentos, horarios y recordatorios para facilitar el seguimiento de tus tratamientos.",
  },
  {
    icon: "svg",
    title: "Indicadores de salud",
    text: "Registra valores, consulta rangos visuales y revisa el historial de tus mediciones.",
  },
  {
    icon: "▤",
    title: "Expediente clínico",
    text: "Organiza diagnósticos, antecedentes, alergias, laboratorios, recetas, estudios y notas.",
  },
  {
    icon: "◎",
    title: "IPCP · Mi prioridad",
    text: "Una herramienta de orientación que ayuda a visualizar el nivel de prioridad y cuándo conviene buscar atención.",
    highlight: true,
  },
  {
    icon: "⌖",
    title: "Recursos de salud",
    text: "Consulta establecimientos y herramientas de orientación para encontrar atención y servicios.",
  },
];

export type ShowcaseTabKey =
  | "citas"
  | "medicamentos"
  | "indicadores"
  | "expediente";

export const showcaseTabs: { key: ShowcaseTabKey; label: string }[] = [
  { key: "citas", label: "Citas" },
  { key: "medicamentos", label: "Medicamentos" },
  { key: "indicadores", label: "Indicadores" },
  { key: "expediente", label: "Expediente" },
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

export const steps = [
  {
    num: "01 · CREA TU PERFIL",
    title: "Registra tu información",
    text: "Crea tu cuenta con tus datos básicos y configura la experiencia según tus necesidades.",
  },
  {
    num: "02 · ORGANIZA",
    title: "Centraliza tu salud",
    text: "Agrega citas, medicamentos, indicadores y documentos clínicos para tener todo más ordenado.",
  },
  {
    num: "03 · DA SEGUIMIENTO",
    title: "Consulta cuando lo necesites",
    text: "Revisa recordatorios, evolución e información relevante directamente desde tu celular.",
  },
];

export const faqItems = [
  {
    question: "¿Qué es Salud Móvil?",
    answer:
      "Es una aplicación móvil que busca centralizar citas, medicamentos, indicadores de salud, expediente clínico y otras herramientas de acompañamiento en una sola experiencia.",
  },
  {
    question: "¿Puedo registrar mis medicamentos y horarios?",
    answer:
      "Sí. El prototipo incluye registro de medicamentos, horarios y configuración de recordatorios.",
  },
  {
    question: "¿Qué incluye el expediente clínico?",
    answer:
      "Diagnósticos, antecedentes, alergias, resultados de laboratorio, recetas, constancias, estudios, notas y documentos médicos.",
  },
  {
    question: "¿\u201CMi prioridad\u201D reemplaza una consulta médica?",
    answer:
      "No. Es una herramienta de orientación y apoyo. No sustituye la evaluación ni el diagnóstico de un profesional de la salud.",
  },
];

export const values = [
  {
    title: "Accesibilidad",
    text: "Diseñamos pensando en diferentes necesidades y capacidades.",
  },
  {
    title: "Inclusión",
    text: "Buscamos que más personas puedan beneficiarse de la tecnología en salud.",
  },
  {
    title: "Claridad",
    text: "Reducimos la complejidad para que la información sea fácil de consultar.",
  },
  {
    title: "Acompañamiento",
    text: "Facilitamos el seguimiento de pacientes, familiares y cuidadores.",
  },
];

export type SocialIconKey =
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "tiktok"
  | "github"
  | "linkedin";

export interface TeamSocialLink {
  icon: SocialIconKey;
  href: string;
  label: string;
}

export interface TeamMember {
  duck: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  socials: TeamSocialLink[];
}

export const teamMembers: TeamMember[] = [
  {
    duck: "Product Duck",
    name: "Freddy Mairena",
    role: "Product Owner y Comunicador",
    bio: "Lidera la visión del producto, organiza prioridades y comunica el propósito y avance de Salud Móvil.",
    photo: freddyPhoto,
    socials: [
      {
        icon: "instagram",
        href: "https://www.instagram.com/freddyenmg?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==",
        label: "Instagram de Freddy",
      },
    ],
  },
  {
    duck: "Marketing Duck",
    name: "Eliva Lovo",
    role: "Mercadóloga",
    bio: "Desarrolla el enfoque de marketing, posicionamiento, comunicación y conexión de la marca con sus públicos.",
    photo: elivaPhoto,
    socials: [
      {
        icon: "instagram",
        href: "https://www.instagram.com/eli_xolanch?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==",
        label: "Instagram de Eliva",
      },
    ],
  },
  {
    duck: "Design Duck",
    name: "Joshua Ochoa",
    role: "Diseñador UI y Diseñador de Marca",
    bio: "Construye la identidad visual y las interfaces de Salud Móvil para lograr una experiencia clara, coherente y reconocible.",
    photo: joshuaPhoto,
    socials: [
      {
        icon: "instagram",
        href: "https://www.instagram.com/joshua_ocm?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==",
        label: "Instagram de Joshua",
      },
    ],
  },
  {
    duck: "Backend Duck",
    name: "Danild Pérez",
    role: "Scrum Master y Desarrollador Full Stack",
    bio: "Coordina el trabajo ágil del equipo y desarrolla la lógica, estructura y servicios que sostienen el funcionamiento de la plataforma.",
    photo: danildPhoto,
    socials: [
      {
        icon: "github",
        href: "https://github.com/danildperez04",
        label: "GitHub de Danild",
      },
      {
        icon: "linkedin",
        href: "https://www.linkedin.com/in/danild-perez2/",
        label: "LinkedIn de Danild",
      },
    ],
  },
  {
    duck: "Frontend & Data Duck",
    name: "Julio Reyes",
    role: "Desarrollador Mobile, Diseñador UX",
    bio: "Desarrolla la experiencia visible de la plataforma, diseña flujos centrados en el usuario y transforma datos en información útil.",
    photo: julioPhoto,
    socials: [
      {
        icon: "github",
        href: "https://github.com/Jarey-17",
        label: "GitHub de Julio",
      },
      {
        icon: "linkedin",
        href: "https://www.linkedin.com/in/julio-antonio-reyes-gonz%C3%A1lez-b1216426b/",
        label: "LinkedIn de Julio",
      },
      {
        icon: "instagram",
        href: "https://www.instagram.com/jarey_gz/",
        label: "Instagram de Julio",
      },
    ],
  },
];

// Foto grupal del equipo, mostrada como tarjeta propia debajo del bloque
// "Conecta con nosotros" en la sección Sobre Nosotros.
export const teamGroupPhoto = {
  photo: groupPhoto,
  title: "Rubber Duckies",
  description:
    "Los cinco integrantes de Rubber Duckies, el equipo detrás de Salud Móvil.",
};

// Recuerdo del Hackathon Disruptivo 2025, mostrado como una tarjeta más
// dentro del grid de miembros del equipo.
export const hackathonMemory = {
  photo: hackathonMemoryPhoto,
  badge: "Rubber Duckies",
  title: "Hackathon Disruptivo 2025",
  description:
    "Un recuerdo de nuestra participación en el Hackathon Disruptivo 2025, el punto de partida del equipo antes de Salud Móvil.",
};

export const footerProductLinks = [
  { href: "#funciones", label: "Funcionalidades" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#prioridad", label: "Mi prioridad" },
  { href: "#descargar", label: "Descargar" },
];

export const footerExploreLinks = [
  { href: "#descubre", label: "Ver la app" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#faq", label: "Preguntas frecuentes" },
  { href: "#sobre-nosotros", label: "Nuestro equipo" },
  { href: "/login", label: "Acceso personal de salud" },
];

export const socialLinks: {
  label: string;
  href: string;
  icon: SocialIconKey;
}[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/salud.movil_app?stkn=MTk4ajBvdzI3b216bA==",
    icon: "instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1BZMmmTKnR/",
    icon: "facebook",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/50584315249",
    icon: "whatsapp",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@salud.movil.app?_r=1&_t=ZS-99jcPox9i42",
    icon: "tiktok",
  },
];
