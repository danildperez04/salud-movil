// features/appointments/api/mock-appointments.ts
//
// Mock temporal — el módulo appointments del backend tiene "entidades
// definidas, sin controlador/servicio" (README). Cuando exista el endpoint
// real, reemplazar fetchMockAppointments por apiClient.get('/appointments'),
// sin tocar AppointmentsScreen.
export type AppointmentRecord = {
  id: string;
  date: string; // ISO
  specialty: string;
  doctorName: string;
  time: string;
  // valor crudo estilo cat_appointment_state — ver nota en constants/labels.ts
  status: string;
};

const mockAppointments: AppointmentRecord[] = [
  {
    id: '1',
    date: '2026-05-15',
    specialty: 'Medicina General',
    doctorName: 'Dr. Juan Pérez',
    time: '10:00 AM',
    status: 'Scheduled',
  },
  {
    id: '2',
    date: '2026-05-22',
    specialty: 'Cardiología',
    doctorName: 'Dra. Ana Gómez',
    time: '09:30 AM',
    status: 'Pending', // ⚠️ mock, ver nota en constants/labels.ts
  },
  {
    id: '3',
    date: '2026-06-05',
    specialty: 'Medicina General',
    doctorName: 'Dr. Juan Pérez',
    time: '11:00 AM',
    status: 'Scheduled',
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockAppointments(): Promise<AppointmentRecord[]> {
  await delay(300);
  return mockAppointments;
}
