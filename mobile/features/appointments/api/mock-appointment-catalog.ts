// features/appointments/api/mock-appointment-catalog.ts
//
// Mock temporal — el backend no expone catálogos de especialidades ni de
// profesionales todavía. TODO: reemplazar por apiClient.get('/catalogues/specialties')
// y apiClient.get('/professionals?specialtyId=...') cuando existan.
export type Specialty = { id: string; name: string };

export type Professional = {
  id: string;
  name: string;
  specialtyId: string;
  /** dónde atiende; pasa a ser el `location` de la cita */
  location: string;
};

const SPECIALTIES: Specialty[] = [
  { id: '1', name: 'Medicina General' },
  { id: '2', name: 'Cardiología' },
  { id: '3', name: 'Pediatría' },
  { id: '4', name: 'Ginecología' },
];

const PROFESSIONALS: Professional[] = [
  { id: '1', name: 'Dr. Juan Pérez', specialtyId: '1', location: 'Hospital Regional' },
  { id: '2', name: 'Dra. María López', specialtyId: '1', location: 'Centro de Salud Central' },
  { id: '3', name: 'Dra. Ana Gómez', specialtyId: '2', location: 'Clínica del Corazón' },
  { id: '4', name: 'Dr. Carlos Ruiz', specialtyId: '2', location: 'Hospital Regional' },
  { id: '5', name: 'Dra. Lucía Martínez', specialtyId: '3', location: 'Centro de Salud Central' },
  { id: '6', name: 'Dra. Sofía Herrera', specialtyId: '4', location: 'Hospital Regional' },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockSpecialties(): Promise<Specialty[]> {
  await delay(200);
  return SPECIALTIES;
}

export async function fetchMockProfessionals(specialtyId: string): Promise<Professional[]> {
  await delay(200);
  return PROFESSIONALS.filter((professional) => professional.specialtyId === specialtyId);
}
