// features/health-resources/hooks/useHospitalGuide.ts
import { useState } from 'react';
import { HOSPITAL_GUIDE_LABELS } from '@/constants/labels';
import { useSpeech } from '@/hooks/useSpeech';
import { joinParts } from '@/lib/text-format';
import { getHospitalRoute, type HospitalZone } from '../domain/hospital-guide';
import { DEFAULT_SERVICE } from '../domain/resource-catalog';
import { useHealthResource } from './useHealthResources';

const labels = HOSPITAL_GUIDE_LABELS;

/** Ruta interna del hospital para el servicio elegido, con pasos y lectura en voz alta. */
export function useHospitalGuide(resourceId?: string, initialService?: string) {
  const { data: resource } = useHealthResource(resourceId);
  const [service, setService] = useState<string>(initialService || DEFAULT_SERVICE);
  const { speak } = useSpeech();

  const route = getHospitalRoute(service);

  const steps = [
    { id: 'enter', title: labels.steps.enterTitle, text: labels.steps.enterText },
    {
      id: 'confirm',
      title: labels.steps.confirmTitle(service),
      text: labels.steps.confirmText(service),
    },
    {
      id: 'follow',
      title: labels.steps.followTitle(route.area),
      text: joinParts([route.hint, labels.steps.accessible], ' '),
    },
  ];

  // recepción se resalta siempre: todas las rutas empiezan ahí
  const activeZones: HospitalZone[] = ['reception', route.zone];

  return {
    hospitalName: resource?.name ?? labels.defaultHospital,
    service,
    setService,
    route,
    steps,
    activeZones,
    start: () => speak(labels.spoken(service, route.area, route.hint)),
  };
}
