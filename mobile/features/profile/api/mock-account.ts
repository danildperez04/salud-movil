// features/profile/api/mock-account.ts
//
// Mock temporal — datos de la cuenta que todavía no vienen del backend (el login
// solo entrega nombre, correo y teléfono). Cuando exista el endpoint del perfil
// del paciente, reemplazar por apiClient sin tocar la pantalla.
export type AccountExtras = {
  /** Número Único de Persona */
  nup: string;
  caregiver?: string;
  disability?: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockAccountExtras(): Promise<AccountExtras> {
  await delay(200);
  return { nup: 'NUP-00125487' };
}
