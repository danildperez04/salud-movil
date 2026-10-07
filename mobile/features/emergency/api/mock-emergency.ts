// features/emergency/api/mock-emergency.ts
//
// Mock temporal — el backend no expone contactos de emergencia todavía. Cuando
// exista el endpoint, reemplazar estas funciones por apiClient sin tocar las pantallas.
import type { EmergencyRelation } from '../domain/emergency-contact-schema';

export type EmergencyContact = {
  id: string;
  name: string;
  relation: EmergencyRelation;
  phone: string;
  /** el contacto principal se muestra primero y es el que sale en el resumen clínico */
  isPrimary: boolean;
};

let contacts: EmergencyContact[] = [
  { id: '1', name: 'María Martínez', relation: 'mother', phone: '+505 8888 8888', isPrimary: true },
  {
    id: '2',
    name: 'Carlos Martínez',
    relation: 'sibling',
    phone: '+505 7777 7777',
    isPrimary: false,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockEmergencyContacts(): Promise<EmergencyContact[]> {
  await delay(250);
  // el principal primero; el resto, en el orden en que se agregaron
  return [...contacts].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
}

export async function createMockEmergencyContact(
  input: Omit<EmergencyContact, 'id'>,
): Promise<EmergencyContact> {
  await delay(300);
  // el primer contacto es principal sí o sí; uno nuevo principal desplaza al anterior
  const isPrimary = input.isPrimary || contacts.length === 0;
  const record: EmergencyContact = { ...input, isPrimary, id: String(Date.now()) };
  contacts = [
    ...contacts.map((contact) => (isPrimary ? { ...contact, isPrimary: false } : contact)),
    record,
  ];
  return record;
}
