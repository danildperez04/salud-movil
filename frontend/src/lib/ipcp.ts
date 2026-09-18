/**
 * Mock del Índice de Prioridad de Control del Paciente (IPCP).
 *
 * El PRD ubica el cálculo del IPCP mediante IA dentro de "Funcionalidades
 * futuras" (ver Tabla 1, fila de funcionalidades extra). Mientras esa pieza
 * no exista en el backend, generamos un valor determinístico por paciente
 * para poder maquetar y probar el diseño de la lista de pacientes.
 *
 * Es determinístico (basado en el id del paciente) a propósito: si fuera
 * puramente aleatorio, el badge cambiaría de color en cada re-render o al
 * volver a cargar la tabla, lo cual se ve como un bug.
 *
 * TODO: eliminar este archivo y consumir el IPCP real desde
 * `api.getPatientIpcp(id)` (o el campo que exponga el backend) cuando esa
 * funcionalidad se implemente.
 */

export type IpcpLevel = 'Alta' | 'Moderada' | 'Baja';

export interface IpcpMock {
  score: number;
  level: IpcpLevel;
}

interface IpcpRange {
  level: IpcpLevel;
  min: number;
  max: number;
}

// Rangos inspirados en el diseño de Figma (92-Alta, 63-Moderada, 18-Baja, etc.)
const IPCP_RANGES: IpcpRange[] = [
  { level: 'Baja', min: 1, max: 39 },
  { level: 'Moderada', min: 40, max: 69 },
  { level: 'Alta', min: 70, max: 99 },
];

/** Hash simple (djb2-like) para derivar un número estable a partir del id. */
function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0; // fuerza a entero de 32 bits
  }
  return Math.abs(hash);
}

/** Genera un IPCP simulado, estable para un mismo `patientId`. */
export function getMockIpcp(patientId: string): IpcpMock {
  const hash = hashId(patientId);
  const range = IPCP_RANGES[hash % IPCP_RANGES.length];
  const span = range.max - range.min + 1;
  const score = range.min + (Math.floor(hash / IPCP_RANGES.length) % span);
  return { score, level: range.level };
}
