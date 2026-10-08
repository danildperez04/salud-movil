// features/auth/domain/login-response.ts
import type { AuthResponse, LoginResponse, Role, TwoFactorChallengeResponse } from '@/types/auth';

// Mobile es solo para pacientes y cuidadores — admin/personal de salud
// gestionan desde el panel web. Esto es UX/acceso, no la fuente de verdad:
// el backend sigue siendo quien realmente autoriza cada endpoint (RolesGuard).
const ALLOWED_MOBILE_ROLES: readonly Role[] = ['patient', 'caregiver'];

export function isMobileRoleAllowed(role: Role): boolean {
  return ALLOWED_MOBILE_ROLES.includes(role);
}

export function isTwoFactorChallenge(
  response: LoginResponse,
): response is TwoFactorChallengeResponse {
  return 'requiresTwoFactor' in response && response.requiresTwoFactor === true;
}

export function isSession(response: LoginResponse): response is AuthResponse {
  return !isTwoFactorChallenge(response);
}
