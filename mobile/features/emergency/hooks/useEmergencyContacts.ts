// features/emergency/hooks/useEmergencyContacts.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createMockEmergencyContact, fetchMockEmergencyContacts } from '../api/mock-emergency';

const CONTACTS_KEY = ['emergency', 'contacts'] as const;

// TODO: reemplazar los mocks por apiClient cuando el backend exponga el endpoint.

export function useEmergencyContacts() {
  return useQuery({ queryKey: CONTACTS_KEY, queryFn: fetchMockEmergencyContacts });
}

export function useCreateEmergencyContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMockEmergencyContact,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}
