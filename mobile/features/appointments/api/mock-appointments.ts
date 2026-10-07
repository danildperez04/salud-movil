// features/appointments/api/mock-appointments.ts
//
// Mock temporal — el módulo appointments del backend tiene "entidades
// definidas, sin controlador/servicio" (README). Cuando exista el endpoint
// real, reemplazar estas funciones por apiClient.get('/appointments'),
// apiClient.get(`/appointments/${id}`) y apiClient.patch(...), sin tocar las
// pantallas.
export type AppointmentRecord = {
  id: string;
  date: string; // YYYY-MM-DD
  specialty: string;
  doctorName: string;
  time: string;
  /** valor tal cual viene de cat_appointment_state.name (ej "Scheduled") */
  status: string;
  location: string;
};

let mockAppointments: AppointmentRecord[] = [
  {
    id: '1',
    date: '2026-05-15',
    specialty: 'Medicina General',
    doctorName: 'Dr. Juan Pérez',
    time: '10:00 AM',
    status: 'Scheduled',
    location: 'Hospital Regional',
  },
  {
    id: '2',
    date: '2026-05-22',
    specialty: 'Cardiología',
    doctorName: 'Dra. Ana Gómez',
    time: '09:30 AM',
    status: 'Pending', // ⚠️ mock, ver nota en constants/labels.ts
    location: 'Clínica del Corazón',
  },
  {
    id: '3',
    date: '2026-06-05',
    specialty: 'Medicina General',
    doctorName: 'Dr. Juan Pérez',
    time: '11:00 AM',
    status: 'Scheduled',
    location: 'Hospital Regional',
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockAppointments(): Promise<AppointmentRecord[]> {
  await delay(300);
  return mockAppointments;
}

export async function fetchMockAppointmentById(id: string): Promise<AppointmentRecord | null> {
  await delay(300);
  return mockAppointments.find((appointment) => appointment.id === id) ?? null;
}

export async function cancelMockAppointment(id: string): Promise<void> {
  await delay(300);
  mockAppointments = mockAppointments.map((appointment) =>
    appointment.id === id ? { ...appointment, status: 'Cancelled' } : appointment,
  );
}
