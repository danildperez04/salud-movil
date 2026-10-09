// features/emergency/hooks/useEmergencyContacts.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loadPatientMe } from '@/features/profile/hooks/usePatientMe';
import { useIsPatient } from '@/hooks/useIsPatient';
import { createMockEmergencyContact, withLocalContacts } from '../api/mock-emergency';
import { contactsFromPatient, type EmergencyContact } from '../domain/emergency-contact';

const CONTACTS_KEY = ['emergency', 'contacts'] as const;

export function useEmergencyContacts() {
  const enabled = useIsPatient();
  return useQuery({
    queryKey: CONTACTS_KEY,
    queryFn: async () => withLocalContacts(contactsFromPatient(await loadPatientMe())),
    enabled,
  });
}

// TODO: agregar contactos es local hasta que el backend admita más de uno.
export function useCreateEmergencyContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<EmergencyContact, 'id'>) =>
      createMockEmergencyContact(
        input,
        queryClient.getQueryData<EmergencyContact[]>(CONTACTS_KEY) ?? [],
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}
