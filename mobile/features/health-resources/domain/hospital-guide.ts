// features/health-resources/domain/hospital-guide.ts
// Ruta dentro del hospital para cada servicio. Sin React.
// TODO: usar los planos reales y autorizados de cada establecimiento.
import { HOSPITAL_GUIDE_LABELS } from '@/constants/labels';

export type HospitalZone = keyof typeof HOSPITAL_GUIDE_LABELS.zones;

/** Orden en que se dibuja el mapa interno (3 columnas). */
export const HOSPITAL_ZONES: HospitalZone[] = [
  'entrance',
  'reception',
  'consulting',
  'emergency',
  'laboratory',
  'imaging',
];

export type HospitalRoute = {
  zone: HospitalZone;
  floor: string;
  /** nombre del área de destino (ej. "Consultorios A") */
  area: string;
  /** indicación para llegar desde recepción */
  hint: string;
};

const GROUND = 'Planta baja';
const FIRST = 'Primer piso';
const SECOND = 'Segundo piso';

const ROUTES: Record<string, HospitalRoute> = {
  'Medicina General': {
    zone: 'consulting',
    floor: GROUND,
    area: 'Consultorios A',
    hint: 'Los consultorios están a pocos pasos de recepción.',
  },
  'Medicina de Emergencias': {
    zone: 'emergency',
    floor: GROUND,
    area: 'Emergencias',
    hint: 'Dirígete directamente a triaje de Emergencias.',
  },
  'Laboratorio Clínico': {
    zone: 'laboratory',
    floor: GROUND,
    area: 'Laboratorio',
    hint: 'Sigue la señalización azul hacia toma de muestras.',
  },
  'Radiología e Imagenología': {
    zone: 'imaging',
    floor: GROUND,
    area: 'Imagenología',
    hint: 'Sigue la señalización morada hacia Radiología e Imagenología.',
  },
  Farmacia: {
    zone: 'reception',
    floor: GROUND,
    area: 'Farmacia hospitalaria',
    hint: 'Desde recepción gira al corredor de servicios y farmacia.',
  },
  'Banco de sangre': {
    zone: 'laboratory',
    floor: GROUND,
    area: 'Banco de sangre',
    hint: 'Dirígete al bloque de Laboratorio y Banco de sangre.',
  },
  Vacunación: {
    zone: 'consulting',
    floor: GROUND,
    area: 'Vacunación',
    hint: 'Dirígete a Consulta externa, módulo de vacunación.',
  },
  Pediatría: {
    zone: 'consulting',
    floor: FIRST,
    area: 'Consultorios Pediátricos',
    hint: 'Desde recepción toma el elevador al primer piso y sigue la señalización de Pediatría.',
  },
  'Ginecología y Obstetricia': {
    zone: 'consulting',
    floor: FIRST,
    area: 'Gineco-Obstetricia',
    hint: 'Toma el elevador al primer piso y sigue la señalización de Gineco-Obstetricia.',
  },
  Cardiología: {
    zone: 'consulting',
    floor: SECOND,
    area: 'Cardiología',
    hint: 'Toma el elevador al segundo piso y sigue el corredor de especialidades.',
  },
  Neurología: {
    zone: 'consulting',
    floor: SECOND,
    area: 'Neurología',
    hint: 'Toma el elevador al segundo piso y sigue el corredor de especialidades.',
  },
  Oncología: {
    zone: 'consulting',
    floor: SECOND,
    area: 'Oncología',
    hint: 'Toma el elevador al segundo piso y sigue la señalización de Oncología.',
  },
};

export function getHospitalRoute(service: string): HospitalRoute {
  return (
    ROUTES[service] ?? {
      zone: 'consulting',
      floor: FIRST,
      area: `Consulta externa · ${service}`,
      hint: 'Desde recepción sigue la señalización de Consulta externa; usa el elevador o la rampa si corresponde.',
    }
  );
}
