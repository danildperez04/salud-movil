// features/emergency/domain/emergency-contact.ts
// Contacto de emergencia tal como lo usan las pantallas, y el que viene en la ficha del
// paciente. Sin React.
import type { EmergencyRelation } from './emergency-contact-schema';

export type EmergencyContact = {
  id: string;
  name: string;
  relation: EmergencyRelation;
  phone: string;
  /** el contacto principal se muestra primero y es el que sale en el resumen clínico */
  isPrimary: boolean;
};

/** Lo que usa la app de `PublicPatient`. */
type PatientEmergencyFields = {
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
};

/**
 * La ficha del paciente guarda un solo contacto de emergencia, sin parentesco: es el principal.
 * Vacío si el paciente no lo tiene.
 */
export function contactsFromPatient(patient: PatientEmergencyFields): EmergencyContact[] {
  const name = patient.emergencyContactName.trim();
  const phone = patient.emergencyContactPhoneNumber.trim();
  if (!name && !phone) return [];

  return [{ id: 'patient', name, relation: 'other', phone, isPrimary: true }];
}
