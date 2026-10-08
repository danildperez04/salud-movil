// types/auth.ts

// Confirmado contra cat_role en la base de datos real.
export type Role = 'patient' | 'caregiver' | 'health_staff' | 'admin';

export interface HealthcareWorkerInfo {
  licenseNumber: string;
  employeeId: string;
  majorId: number | null;
  majorName: string | null;
  healthCenterId: string | null;
  healthCenterName: string | null;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  address: string;
  municipalityId: number;
  role: Role;
  twoFactorEnabled: boolean;
  healthcareWorker: HealthcareWorkerInfo | null;
}

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
}

/** Desafío OTP que la API devuelve en vez de la sesión cuando la cuenta tiene 2FA. */
export interface TwoFactorChallengeResponse {
  requiresTwoFactor: true;
  challengeId: string;
  /** ISO 8601 */
  expiresAt: string;
}

/** `POST /auth/login`: sesión directa o desafío de 2FA; se distinguen por `requiresTwoFactor`. */
export type LoginResponse = AuthResponse | TwoFactorChallengeResponse;

/** Desafío emitido por resend / enable (sin el flag `requiresTwoFactor`). */
export interface TwoFactorTicket {
  challengeId: string;
  expiresAt: string;
}

export interface VerifyTwoFactorDto {
  challengeId: string;
  code: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterCaregiverDto {
  name: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
  address: string;
  municipalityId: string;
}
