// features/health-resources/hooks/useResourceActions.ts
import { HEALTH_MAP_LABELS } from '@/constants/labels';
import { externalLinks, openExternalLink } from '@/lib/external-links';
import type { HealthResource } from '../api/mock-health-resources';

/** Acciones de contacto y navegación hacia un recurso sanitario. */
export function useResourceActions(resource: HealthResource) {
  return {
    openDirections: () => openExternalLink(externalLinks.systemMaps(resource.address)),
    openGoogleMaps: () => openExternalLink(externalLinks.googleMaps(resource.address)),
    openWaze: () => openExternalLink(externalLinks.waze(resource.address)),
    call: () => openExternalLink(externalLinks.phone(resource.phone)),
    openWhatsApp: () =>
      openExternalLink(
        externalLinks.whatsapp(
          HEALTH_MAP_LABELS.detail.whatsappMessage(resource.name),
          resource.phone,
        ),
      ),
  };
}
