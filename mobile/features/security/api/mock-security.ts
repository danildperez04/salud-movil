// features/security/api/mock-security.ts
//
// Mock temporal — el backend no expone sesiones ni cambio de contraseña desde la
// app móvil todavía. Cuando existan, reemplazar por apiClient sin tocar las pantallas.
export type DeviceSession = {
  id: string;
  name: string;
  platform: 'mobile' | 'web';
  /** ubicación aproximada de la sesión (solo se muestra en la actual) */
  location?: string;
  /** fecha y hora ISO del último acceso */
  lastAccessAt: string;
  isCurrent: boolean;
};

const yesterdayEvening = new Date();
yesterdayEvening.setDate(yesterdayEvening.getDate() - 1);
yesterdayEvening.setHours(20, 42, 0, 0);

let sessions: DeviceSession[] = [
  {
    id: '1',
    name: 'Este teléfono',
    platform: 'mobile',
    location: 'Nicaragua',
    lastAccessAt: new Date().toISOString(),
    isCurrent: true,
  },
  {
    id: '2',
    name: 'Navegador Chrome',
    platform: 'web',
    lastAccessAt: yesterdayEvening.toISOString(),
    isCurrent: false,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockSessions(): Promise<DeviceSession[]> {
  await delay(250);
  return sessions;
}

export async function closeMockSession(id: string): Promise<void> {
  await delay(250);
  // la sesión actual no se cierra desde aquí: para eso está "Cerrar sesión"
  sessions = sessions.filter((session) => session.id !== id || session.isCurrent);
}

export async function closeMockOtherSessions(): Promise<void> {
  await delay(300);
  sessions = sessions.filter((session) => session.isCurrent);
}

export async function changeMockPassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  // TODO: PATCH /auth/password. El mock no valida la contraseña actual.
  void input;
  await delay(500);
}
