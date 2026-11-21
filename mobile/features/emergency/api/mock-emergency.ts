// features/emergency/api/mock-emergency.ts
//
// Mock temporal de los contactos adicionales: la ficha del paciente en el backend guarda un
// solo contacto de emergencia (ver contactsFromPatient) y no hay endpoint para agregar más.
// Lo que se agrega queda solo en el dispositivo y se suma al contacto real.
// TODO: reemplazar por apiClient cuando el backend admita varios contactos.
import { createLocalOverlay, newLocalId } from '@/lib/local-overlay';
import type { EmergencyContact } from '../domain/emergency-contact';

const localContacts = createLocalOverlay<EmergencyContact>();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Los contactos reales más los locales: el principal primero, el resto en el orden en que se agregaron. */
export const withLocalContacts = (remote: EmergencyContact[]) =>
  localContacts.apply(remote).sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

/** `current` son los contactos que se ven ahora: si el nuevo es principal, desplaza al anterior. */
export async function createMockEmergencyContact(
  input: Omit<EmergencyContact, 'id'>,
  current: EmergencyContact[],
): Promise<EmergencyContact> {
  await delay(300);
  // el primer contacto es principal sí o sí
  const isPrimary = input.isPrimary || current.length === 0;
  const record: EmergencyContact = { ...input, isPrimary, id: newLocalId() };
  if (isPrimary) {
    current
      .filter((contact) => contact.isPrimary)
      .forEach((contact) => localContacts.upsert({ ...contact, isPrimary: false }));
  }
  localContacts.upsert(record);
  return record;
}
