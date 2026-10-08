export interface ApiUser {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  address: string;
  municipalityId: number;
  role: string;
  twoFactorEnabled: boolean;
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
  twoFactorEnabled: boolean;
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
  /** Solo el administrador puede reasignar el centro de salud. */
  healthCenterId?: string;
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

export interface PublicCaregiverDetail {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  address: string;
  dni: string | null;
  isActive: boolean;
  municipalityId?: number;
}

export interface CreateCaregiverPayload {
  name: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
  address: string;
  dni?: string;
  municipalityId: number;
}

export interface UpdateCaregiverPayload {
  name?: string;
  email?: string;
  username?: string;
  phoneNumber?: string;
  address?: string;
  dni?: string;
  isActive?: boolean;
  password?: string;
}

export interface PublicPatientLink {
  patientId: string;
  patientName: string;
  patientEmail: string;
  relationshipTypeName: string;
  isPrimary: boolean;
  dateLink: string;
}

// ---------------------------------------------------------------------------
// Indicadores de salud
// ---------------------------------------------------------------------------

/**
 * Gravedad según las bandas clínicas (`clinical_range_band`).
 * `null` cuando el tipo de indicador no tiene bandas definidas.
 */
export type IndicatorSeverity = 'normal' | 'alert' | 'critical' | null;

/** Clasificación binaria. Se conserva por compatibilidad con el cliente móvil. */
export type IndicatorStatus = 'low' | 'normal' | 'high' | null;

export interface PublicHealthIndicator {
  id: string;
  typeIndicatorId: number;
  typeIndicatorName: string;
  measurementUnit: string;
  value: number;
  valueSecondary: number | null;
  dateHour: string;
  notes: string | null;
  registeredById: string;
  registeredByName: string;
  status: IndicatorStatus;
  severity: IndicatorSeverity;
  band: string | null;
}

export interface PublicIndicatorSummary {
  typeIndicatorId: number;
  typeIndicatorName: string;
  measurementUnit: string;
  value: number;
  valueSecondary: number | null;
  dateHour: string;
  status: IndicatorStatus;
  severity: IndicatorSeverity;
  band: string | null;
  minValue: number | null;
  maxValue: number | null;
  minValueSecondary: number | null;
  maxValueSecondary: number | null;
}

export interface CreateHealthIndicatorPayload {
  typeIndicatorId: number;
  value: number;
  /** Obligatorio para presión arterial. */
  valueSecondary?: number;
  dateHour?: string;
  notes?: string;
}

export interface UpdateHealthIndicatorPayload {
  typeIndicatorId?: number;
  value?: number;
  valueSecondary?: number;
  dateHour?: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Citas médicas
// ---------------------------------------------------------------------------

export interface PublicAppointment {
  id: string;
  dateHour: string;
  reason: string;
  durationMinutes: number | null;
  appointmentStateId: number;
  appointmentStateName: string;
  appointmentTypeId: number;
  appointmentTypeName: string;
  cancelReason: string | null;
  cancelledAt: string | null;
  patientId: string;
  patientName: string;
  healthcareWorkerId: string;
  healthcareWorkerName: string;
}

export interface CreateAppointmentPayload {
  dateHour: string;
  reason: string;
  appointmentTypeId: number;
  healthcareWorkerId?: string;
  durationMinutes?: number;
}

export interface UpdateAppointmentPayload {
  dateHour?: string;
  reason?: string;
  appointmentTypeId?: number;
  healthcareWorkerId?: string;
  durationMinutes?: number;
}

// ---------------------------------------------------------------------------
// Medicamentos
// ---------------------------------------------------------------------------

export interface PublicMedicationSchedule {
  id: string;
  hour: string;
  timesPerDay: number;
  days: number[];
}

export interface PublicMedication {
  id: string;
  drugName: string;
  dose: string;
  instructions: string | null;
  startDate: string;
  endDate: string | null;
  active: boolean;
  routeAdministrationId: number;
  routeAdministrationName: string;
  prescribedById: string | null;
  prescribedByName: string | null;
  schedules: PublicMedicationSchedule[];
}

export interface CreateMedicationSchedulePayload {
  hour: string;
  timesPerDay: number;
  days: number[];
}

export interface CreateMedicationPayload {
  drugName: string;
  dose: string;
  instructions?: string;
  startDate: string;
  endDate?: string;
  active?: boolean;
  routeAdministrationId: number;
  schedules: CreateMedicationSchedulePayload[];
}

export interface UpdateMedicationPayload {
  drugName?: string;
  dose?: string;
  instructions?: string;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  routeAdministrationId?: number;
  schedules?: CreateMedicationSchedulePayload[];
}

// ---------------------------------------------------------------------------
// Recordatorios
// ---------------------------------------------------------------------------

export interface PublicMedicationReminderItem {
  type: 'medication';
  id: string;
  medicationId: string;
  scheduleId: string;
  title: string;
  dose: string;
  dateHour: string;
  reminderAt: string;
  confirmedAt: string | null;
  notificationState: string;
}

export interface PublicAppointmentReminderItem {
  type: 'appointment';
  id: string;
  appointmentId: string;
  title: string;
  professionalName: string;
  specialty: string;
  dateHour: string;
  reminderAt: string;
  notificationState: string;
}

export type PublicReminder =
  | PublicMedicationReminderItem
  | PublicAppointmentReminderItem;

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

export interface PublicPatientAttention {
  id: string;
  name: string;
  healthCenterName: string;
  indicatorName: string | null;
  indicatorValue: number | null;
  indicatorUnit: string | null;
  indicatorDateHour: string | null;
  severity: IndicatorSeverity;
  band: string | null;
}

export interface PublicDashboardStats {
  totalPatients: number;
  activePatients: number;
  patientsWithAttention: number;
  upcomingAppointments: number;
  pendingMedicationIntakes: number;
  attention: PublicPatientAttention[];
  generatedAt: string;
}

// === IPCP (Índice Prioritario de Control de Pacientes) ===
//
// Los pesos, cortes y umbrales son PROVISIONALES, pendientes de validación
// médica. El índice es una regla determinista y explicable, no IA, y no
// diagnostica: prioriza y apoya el seguimiento.

export type IpcpLevel = "low" | "moderate" | "high";

export type IpcpComponentKey =
  | "indicatorDeviation"
  | "adherence"
  | "appointmentControl"
  | "trend";

export interface IpcpIndicatorDetail {
  typeIndicatorId: number;
  typeIndicatorName: string;
  value: number;
  valueSecondary: number | null;
  severity: IndicatorSeverity;
  band: string;
}

export interface IpcpComponent {
  key: IpcpComponentKey;
  label: string;
  /** `null` cuando la variable no tiene datos y no puntúa. */
  score: number | null;
  weight: number;
  /** Peso aplicado tras renormalizar; menor que `weight` si algo no puntuó. */
  effectiveWeight: number;
  unavailableReason: string | null;
  detail: string;
  indicators?: IpcpIndicatorDetail[];
}

export interface PublicIpcp {
  score: number;
  level: IpcpLevel;
  components: IpcpComponent[];
  exclusions: string[];
  computedFrom: string | null;
  generatedAt: string;
}

// === 2FA (Two-Factor Authentication) ===

export interface TwoFactorRequiredResponse {
  requiresTwoFactor: true;
  challengeId: string;
  expiresAt: string;
}

export type LoginResponse = AuthResponse | TwoFactorRequiredResponse;

export interface TwoFactorChallengeInfo {
  challengeId: string;
  expiresAt: string;
}

export interface VerifyTwoFactorDto {
  challengeId: string;
  code: string;
}

export interface DisableTwoFactorDto {
  password: string;
}

// === IPCP Batch ===

export interface IpcpSummary {
  id: string;
  name: string;
  email: string;
  score: number;
  level: IpcpLevel;
  deviationScore: number | null;
  adherenceScore: number | null;
  appointmentScore: number | null;
  trendScore: number | null;
  updatedAt: string;
}

export interface IpcpBatchResponse {
  data: IpcpSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IpcpBatchFilters {
  level?: IpcpLevel;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'score' | 'level' | 'name';
  sortOrder?: 'asc' | 'desc';
}
