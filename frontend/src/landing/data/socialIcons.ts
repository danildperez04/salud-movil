import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import type { SocialIconKey } from "./content";

export const SOCIAL_ICONS: Record<SocialIconKey, IconType> = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
  whatsapp: FaWhatsapp,
  tiktok: FaTiktok,
  github: FaGithub,
  linkedin: FaLinkedinIn,
};
