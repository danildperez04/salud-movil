// types/auth.ts

// Confirmado con login real: "admin". Faltan confirmar los códigos de
// patient / caregiver / healthcare_worker (probablemente mismo patrón
// en minúscula con guion bajo, pero no lo asumo sin verlo).
export type Role = 'admin' | (string & {});

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
