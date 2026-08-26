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
  healthcareWorker: HealthcareWorkerInfo | null;
}

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
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
