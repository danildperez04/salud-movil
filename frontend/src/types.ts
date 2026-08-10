export interface ApiUser {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  address: string;
  municipalityId: number;
  role: string;
  healthcareWorker?: {
    licenseNumber: string;
    employeeId: string;
    majorId?: number;
    majorName?: string;
    healthCenterId?: string;
    healthCenterName?: string;
  } | null;
}

export interface AuthResponse {
  user: ApiUser;
  accessToken: string;
}

export interface CatalogueItem {
  id: number;
  name: string;
}

export interface MunicipalityItem extends CatalogueItem {
  departmentId: number;
}

export interface HealthCenterItem {
  id: string;
  name: string;
}

export interface PublicStaff extends ApiUser {
  dni: string | null;
  isActive: boolean;
}

export interface PublicPatient {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  address: string;
  dni: string | null;
  isActive: boolean;
  municipalityId: number;
  municipalityName: string;
  dateOfBirth: string;
  genreId: number;
  genreName: string;
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
  healthCenterId: string;
  healthCenterName: string;
}

export interface PublicCaregiverLink {
  caregiverId: string;
  caregiverName: string;
  caregiverEmail: string;
  caregiverUsername: string;
  caregiverPhoneNumber: string;
  relationshipTypeId: number;
  relationshipTypeName: string;
  isPrimary: boolean;
}

export interface PublicCaregiver {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  dni: string | null;
}

export interface PublicMedicalVisit {
  id: string;
  visitDate: string;
  diagnosis: string;
  observations: string;
  treatment: string;
  nextVisitDate: string | null;
  healthcareWorkerId: string;
  healthcareWorkerName: string;
}

export interface PublicMedicalRecord {
  primaryDiagnosis: string;
  medicalHistory: string;
  allergies: string;
  bloodType: string | null;
  createDate: string;
  updateDate: string;
  visits: PublicMedicalVisit[];
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
  address: string;
  dni?: string;
  municipalityId: number;
  licenseNumber: string;
  employeeId: string;
  majorId: number;
  healthCenterId: string;
}

export interface UpdateStaffPayload {
  name?: string;
  email?: string;
  username?: string;
  phoneNumber?: string;
  address?: string;
  dni?: string;
  isActive?: boolean;
  password?: string;
}

export interface CreatePatientPayload {
  name: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
  address: string;
  dni?: string;
  municipalityId: number;
  dateOfBirth: string;
  genreId: number;
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
  healthCenterId?: string;
}

export interface UpdatePatientPayload {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  phoneNumber?: string;
  address?: string;
  dni?: string;
  municipalityId?: number;
  dateOfBirth?: string;
  genreId?: number;
  emergencyContactName?: string;
  emergencyContactPhoneNumber?: string;
}

export interface LinkCaregiverPayload {
  caregiverId: string;
  relationshipTypeId: number;
  isPrimary?: boolean;
}

export interface UpdateMedicalRecordPayload {
  primaryDiagnosis: string;
  medicalHistory: string;
  allergies: string;
  bloodType?: string;
}

export interface CreateMedicalVisitPayload {
  visitDate?: string;
  diagnosis: string;
  observations: string;
  treatment: string;
  nextVisitDate?: string;
}
