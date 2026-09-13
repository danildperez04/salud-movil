// features/medications/api/mock-medications.ts
//
// Mock temporal — mismo criterio que health-indicators y appointments.
// TODO: reemplazar por endpoints reales cuando el módulo medications
// tenga controlador/servicio en el backend.
export type MedicationRecord = {
  id: string;
  drugName: string;
  dose: string;
  // "1 tableta" — no viene de la tabla `medication`, sale de
  // medication_schedule (ver nota en features/medications/components/MedicationCard.tsx)
  quantityLabel: string;
  time: string;
  active: boolean;
};

let mockMedications: MedicationRecord[] = [
  {
    id: '1',
    drugName: 'Losartán',
    dose: '50mg',
    quantityLabel: '1 tableta',
    time: '09:00 AM',
    active: true,
  },
  {
    id: '2',
    drugName: 'Metoprolol',
    dose: '850mg',
    quantityLabel: '1 tableta',
    time: '12:00 pM',
    active: true,
  },
  {
    id: '3',
    drugName: 'Atorvastatina',
    dose: '20mg',
    quantityLabel: '1 tableta',
    time: '08:00 AM',
    active: false,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockMedications(): Promise<MedicationRecord[]> {
  await delay(300);
  return mockMedications;
}

export async function toggleMockMedicationActive(
  id: string,
  active: boolean,
): Promise<MedicationRecord> {
  await delay(200);
  mockMedications = mockMedications.map((med) => (med.id === id ? { ...med, active } : med));
  const updated = mockMedications.find((med) => med.id === id);
  if (!updated) throw new Error('Medicamento no encontrado');
  return updated;
}
