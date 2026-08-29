// features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api-client';
import { useAppStore } from '@/store';
import type { AuthResponse, LoginDto } from '@/types/auth';

export function useLogin() {
  const setSession = useAppStore((state) => state.setSession);

  return useMutation<AuthResponse, ApiError, LoginDto>({
    mutationFn: (dto) => apiClient.post<AuthResponse>('/auth/login', dto, { auth: false }),
    onSuccess: (data) => {
      setSession(data);
    },
  });
}
