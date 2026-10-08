/**
 * ⛔ **MOCK FUERA DEL MVP — NO IMPORTAR.**
 *
 * El IPCP **ya existe y es real**: lo calcula `GET /patients/:id/ipcp` y lo
 * consume la ficha del paciente (`patient-detail/IpcpCard.tsx`) con
 * `api.getPatientIpcp(id)`. La API devuelve además un desglose por variable,
 * que este archivo no puede imitar porque no lee ningún dato clínico.
 *
 * Este archivo **se conserva a propósito** (no se borra) para dejar registro de
 * cómo era la maqueta y de qué reemplazó. Está en la lista de *fuera del MVP*
 * del plan de cierre: se elimina en la limpieza posterior, no antes.
 *
 * Por qué importa que no se use: `getMockIpcp` devuelve un hash del UUID del
 * paciente, o sea **prioridad clínica inventada** para personas reales. Una
 * lista ordenada por esa columna mezclaría a los pacientes según un número que
 * no sale de sus datos.
 *
 * ⚠️ Bugs conocidos que quedan sin corregir, porque corregir código muerto sería
 * trabajo desperdiciado:
 * 1. El nivel y el score se eligen con **partes disjuntas** del mismo hash
 *    (`hash % 3` y `Math.floor(hash / 3) % span`), así que un paciente puede
 *    salir "Alta" con score 40, contradiciendo sus propios umbrales.
 * 2. Los cortes son 1-39 / 40-69 / 70-99, mientras la API usa 0-39 / 40-69 /
 *    70-100 en inglés (`low` / `moderate` / `high`). Sobrevivió `low`/`moderate`/
 *    `high` porque es el vocabulario de máquina que usa el resto de la API.
 *
 * El flujo de verificación (`pnpm ci:frontend`) falla si alguien importa este
 * archivo.
 *
 * ─── Historial ────────────────────────────────────────────────────────────
 * Mock del Índice de Prioridad de Control del Paciente (IPCP).
 *
 * El PRD ubicaba el cálculo del IPCP mediante IA dentro de "Funcionalidades
 * futuras" (Tabla 1, fila de funcionalidades extra). Se usaba para maquetar la
 * lista de pacientes.
 *
 * Nota: el IPCP no es IA. Es una regla explicable y determinista sobre
 * indicadores medidos, adherencia, cumplimiento de controles y tendencia.
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

/**
 * Genera un IPCP simulado, estable para un mismo `patientId`.
 *
 * ⛔ No usar. Ver el aviso de la cabecera del archivo.
 */
export function getMockIpcp(patientId: string): IpcpMock {
  const hash = hashId(patientId);
  const range = IPCP_RANGES[hash % IPCP_RANGES.length];
  const span = range.max - range.min + 1;
  const score = range.min + (Math.floor(hash / IPCP_RANGES.length) % span);
  return { score, level: range.level };
}
