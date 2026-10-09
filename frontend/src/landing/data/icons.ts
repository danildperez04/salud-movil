import {
  Accessibility,
  Activity,
  BellRing,
  CalendarClock,
  Eye,
  FileSearch,
  FileText,
  Gauge,
  HeartHandshake,
  LayoutGrid,
  MapPinned,
  Pill,
  UserRoundPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import type { SocialIconKey } from "./social";

// Registro único de iconos de contenido. Los datos (data/*.ts) guardan solo la
// clave; así el copy sigue siendo texto plano y todos los iconos de la landing
// salen de la misma familia (antes eran glifos Unicode que cada fuente dibujaba
// distinto).
export const ICONS = {
  citas: CalendarClock,
  medicamentos: Pill,
  indicadores: Activity,
  expediente: FileText,
  documentos: FileSearch,
  prioridad: Gauge,
  recursos: MapPinned,
  perfil: UserRoundPlus,
  organiza: LayoutGrid,
  seguimiento: BellRing,
  accesibilidad: Accessibility,
  inclusion: HeartHandshake,
  claridad: Eye,
  acompanamiento: Users,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof ICONS;

export const SOCIAL_ICONS: Record<SocialIconKey, IconType> = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
  whatsapp: FaWhatsapp,
  tiktok: FaTiktok,
  github: FaGithub,
  linkedin: FaLinkedinIn,
};
