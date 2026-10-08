// Fotos del equipo (Vite las procesa como assets con hash de caché)
import danildPhoto from "../../assets/Danild.jpeg";
import elivaPhoto from "../../assets/Eli.png";
import freddyPhoto from "../../assets/Freddy.jpeg";
import julioPhoto from "../../assets/jarey.jpeg";
import joshuaPhoto from "../../assets/Joshua.jpeg";
import groupPhoto from "../../assets/Grupo.jpeg";
import hackathonMemoryPhoto from "../../assets/grupo_Hk_2025.jpeg";
import type { IconKey } from "./icons";
import type { SocialIconKey } from "./social";

export const values: { icon: IconKey; title: string; text: string }[] = [
  {
    icon: "accesibilidad",
    title: "Accesibilidad",
    text: "Diseñamos pensando en diferentes necesidades y capacidades.",
  },
  {
    icon: "inclusion",
    title: "Inclusión",
    text: "Buscamos que más personas puedan beneficiarse de la tecnología en salud.",
  },
  {
    icon: "claridad",
    title: "Claridad",
    text: "Reducimos la complejidad para que la información sea fácil de consultar.",
  },
  {
    icon: "acompanamiento",
    title: "Acompañamiento",
    text: "Facilitamos el seguimiento de pacientes, familiares y cuidadores.",
  },
];

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
