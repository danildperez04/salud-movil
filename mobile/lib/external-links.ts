// lib/external-links.ts
// Enlaces a aplicaciones externas (mapas, teléfono, WhatsApp). Se usan enlaces
// universales (https) siempre que se puede: así no hace falta declarar esquemas
// en la configuración nativa.
import { Alert, Linking, Platform } from 'react-native';
import { COMMON_LABELS } from '@/constants/labels';

const enc = encodeURIComponent;
const digitsOnly = (phone: string) => phone.replace(/\D/g, '');

export const externalLinks = {
  /** Abre la app de mapas del sistema (Apple Maps / la que el usuario elija en Android). */
  systemMaps: (query: string) =>
    Platform.select({ ios: `maps:0,0?q=${enc(query)}`, default: `geo:0,0?q=${enc(query)}` }),
  googleMaps: (query: string) => `https://www.google.com/maps/search/?api=1&query=${enc(query)}`,
  waze: (query: string) => `https://waze.com/ul?q=${enc(query)}&navigate=yes`,
  /** Sin número, abre el marcador vacío para que el usuario escriba el oficial. */
  phone: (phone?: string) => `tel:${phone ? phone.replace(/\s/g, '') : ''}`,
  /** Sin número, WhatsApp deja elegir el contacto al que se envía el mensaje. */
  whatsapp: (message: string, phone?: string) =>
    `https://wa.me/${phone ? digitsOnly(phone) : ''}?text=${enc(message)}`,
};

/** Abre un enlace externo; si el dispositivo no puede, avisa en vez de fallar en silencio. */
export async function openExternalLink(url: string | undefined) {
  if (!url) return;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(COMMON_LABELS.externalLinkErrorTitle, COMMON_LABELS.externalLinkErrorMessage);
  }
}
