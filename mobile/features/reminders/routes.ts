// features/reminders/routes.ts
// Destinos de navegación del feature, en un solo lugar para no repetir strings.
import type { Href } from 'expo-router';

export const reminderRoutes = {
  list: '/(app)/reminders' as Href,
  newMedication: '/(app)/reminders/medication/new' as Href,
  editMedication: (id: string): Href => `/(app)/reminders/medication/${id}`,
  newAppointment: '/(app)/reminders/appointment/new' as Href,
  editAppointment: (id: string): Href => `/(app)/reminders/appointment/${id}`,
};
