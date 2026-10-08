export type SocialIconKey =
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "tiktok"
  | "github"
  | "linkedin";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIconKey;
}

export const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/salud.movil_app?stkn=MTk4ajBvdzI3b216bA==",
    icon: "instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1DimtuBcaY/",
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
