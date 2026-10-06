import type {
  AuthResponse,
  CatalogueItem,
  CreateAppointmentPayload,
  CreateCaregiverPayload,
  CreateHealthIndicatorPayload,
  CreateMedicalVisitPayload,
  CreateMedicationPayload,
  CreatePatientPayload,
  CreateStaffPayload,
  HealthCenterItem,
  LinkCaregiverPayload,
  MunicipalityItem,
  PublicAppointment,
  PublicCaregiver,
  PublicCaregiverDetail,
  PublicCaregiverLink,
  PublicDashboardStats,
  PublicHealthIndicator,
  PublicIpcp,
  PublicIndicatorSummary,
  PublicMedicalRecord,
  PublicMedication,
  PublicPatient,
  PublicPatientLink,
  PublicReminder,
  PublicStaff,
  UpdateAppointmentPayload,
  UpdateCaregiverPayload,
  UpdateHealthIndicatorPayload,
  UpdateMedicalRecordPayload,
  UpdateMedicationPayload,
  UpdatePatientPayload,
  UpdateStaffPayload,
} from '../types';

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

let tokenGetter: () => string | null = () => null;
let unauthorizedHandler: () => void = () => {};

export function setTokenGetter(getter: () => string | null) {
  tokenGetter = getter;
}

/**
 * Se invoca cuando la API responde 401. Lo registra el store de autenticación
 * para limpiar la sesión: sin esto, un token expirado dejaba al usuario
 * atascado viendo errores en lugar de volver al login.
 */
export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

interface ApiErrorBody {
  message?: string | string[];
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

type QueryValue = string | number | boolean | null | undefined;

/** Serializa query params omitiendo los vacíos, sin dejar `?a=&b=`. */
function withQuery(path: string, query?: Record<string, QueryValue>): string {
  if (!query) {
    return path;
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenGetter();
  const headers: Record<string, string> = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string> | undefined),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }

  if (response.status === 401) {
    unauthorizedHandler();
  }

  if (!response.ok) {
    let message = 'Ocurrió un error inesperado';
    try {
      const body = (await response.json()) as ApiErrorBody;
      if (typeof body.message === 'string') {
        message = body.message;
      } else if (Array.isArray(body.message) && body.message.length > 0) {
        message = body.message[0];
      }
    } catch {
      // Se conserva el mensaje por defecto
    }
    throw new ApiError(message, response.status);
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError('El servidor devolvió una respuesta inesperada', response.status);
  }
}

export const api = {
  login(email: string, password: string) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  me() {
    return request<AuthResponse['user']>('/auth/me');
  },

  /**
   * La API responde siempre 200 con un mensaje genérico, exista o no la cuenta,
   * y no devuelve el token. `{ message }` documenta ese contrato.
   */
  requestPasswordReset(email: string) {
    return request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  getDepartments() {
    return request<CatalogueItem[]>('/catalogues/departments');
  },

  getMunicipalities(departmentId?: number) {
    const query = departmentId ? `?departmentId=${departmentId}` : '';
    return request<MunicipalityItem[]>(`/catalogues/municipalities${query}`);
  },

  getGenres() {
    return request<CatalogueItem[]>('/catalogues/genres');
  },

  getRelationshipTypes() {
    return request<CatalogueItem[]>('/catalogues/relationship-types');
  },

  getMajors() {
    return request<CatalogueItem[]>('/catalogues/majors');
  },

  getHealthCenters() {
    return request<HealthCenterItem[]>('/catalogues/health-centers');
  },

  /** Tipos de cita, para el formulario de agenda. */
  getAppointmentTypes() {
    return request<CatalogueItem[]>('/catalogues/appointment-types');
  },

  /** Vías de administración, para el formulario de medicamentos. */
  getRouteAdministrations() {
    return request<CatalogueItem[]>('/catalogues/route-administrations');
  },

  /** Estados de cita, para filtrar la agenda sin escribir el texto a mano. */
  getAppointmentStates() {
    return request<CatalogueItem[]>('/catalogues/appointment-states');
  },

  searchCaregivers(q: string) {
    return request<PublicCaregiver[]>('/caregivers?q=' + encodeURIComponent(q));
  },

  listUsers() {
    return request<PublicStaff[]>('/users');
  },

  getUser(id: string) {
    return request<PublicStaff>(`/users/${id}`);
  },

  createStaff(payload: CreateStaffPayload) {
    return request<PublicStaff>('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateUser(id: string, payload: UpdateStaffPayload) {
    return request<PublicStaff>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteUser(id: string) {
    return request<void>(`/users/${id}`, { method: 'DELETE' });
  },

  listPatients(q?: string) {
    const query = q ? `?q=${encodeURIComponent(q)}` : '';
    return request<PublicPatient[]>(`/patients${query}`);
  },

  getPatient(id: string) {
    return request<PublicPatient>(`/patients/${id}`);
  },

  createPatient(payload: CreatePatientPayload) {
    return request<PublicPatient>('/patients', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updatePatient(id: string, payload: UpdatePatientPayload) {
    return request<PublicPatient>(`/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deletePatient(id: string) {
    return request<void>(`/patients/${id}`, { method: 'DELETE' });
  },

  getPatientCaregivers(patientId: string) {
    return request<PublicCaregiverLink[]>(`/patients/${patientId}/caregivers`);
  },

  linkCaregiver(patientId: string, payload: LinkCaregiverPayload) {
    return request<PublicCaregiverLink>(`/patients/${patientId}/caregivers`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  unlinkCaregiver(patientId: string, caregiverId: string) {
    return request<void>(`/patients/${patientId}/caregivers/${caregiverId}`, {
      method: 'DELETE',
    });
  },

  getCaregiver(id: string) {
    return request<PublicCaregiverDetail>(`/caregivers/${id}`);
  },

  createCaregiver(payload: CreateCaregiverPayload) {
    return request<PublicCaregiverDetail>('/caregivers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateCaregiver(id: string, payload: UpdateCaregiverPayload) {
    return request<PublicCaregiverDetail>(`/caregivers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteCaregiver(id: string) {
    return request<void>(`/caregivers/${id}`, { method: 'DELETE' });
  },

  getCaregiverPatients(id: string) {
    return request<PublicPatientLink[]>(`/caregivers/${id}/patients`);
  },

  getMedicalRecord(patientId: string) {
    return request<PublicMedicalRecord>(`/patients/${patientId}/medical-record`);
  },

  updateMedicalRecord(patientId: string, payload: UpdateMedicalRecordPayload) {
    return request<PublicMedicalRecord>(`/patients/${patientId}/medical-record`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  createMedicalVisit(patientId: string, payload: CreateMedicalVisitPayload) {
    return request<PublicMedicalRecord>(`/patients/${patientId}/medical-visits`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  // --- Panel ---

  getDashboardStats() {
    return request<PublicDashboardStats>('/dashboard/stats');
  },

  // --- Indicadores de salud ---

  getPatientHealthIndicators(
    patientId: string,
    query?: { typeIndicatorId?: number; from?: string; to?: string },
  ) {
    return request<PublicHealthIndicator[]>(
      withQuery(`/patients/${patientId}/health-indicators`, query),
    );
  },

  getPatientHealthIndicatorsLatest(patientId: string) {
    return request<PublicHealthIndicator[]>(
      `/patients/${patientId}/health-indicators/latest`,
    );
  },

  getPatientHealthIndicatorsSummary(patientId: string) {
    return request<PublicIndicatorSummary[]>(
      `/patients/${patientId}/health-indicators/summary`,
    );
  },

  createPatientHealthIndicator(
    patientId: string,
    payload: CreateHealthIndicatorPayload,
  ) {
    return request<PublicHealthIndicator>(
      `/patients/${patientId}/health-indicators`,
      { method: 'POST', body: JSON.stringify(payload) },
    );
  },

  updatePatientHealthIndicator(
    patientId: string,
    indicatorId: string,
    payload: UpdateHealthIndicatorPayload,
  ) {
    return request<PublicHealthIndicator>(
      `/patients/${patientId}/health-indicators/${indicatorId}`,
      { method: 'PATCH', body: JSON.stringify(payload) },
    );
  },

  deletePatientHealthIndicator(patientId: string, indicatorId: string) {
    return request<void>(`/patients/${patientId}/health-indicators/${indicatorId}`, {
      method: 'DELETE',
    });
  },

  // --- Citas médicas ---

  getPatientAppointments(patientId: string) {
    return request<PublicAppointment[]>(`/patients/${patientId}/appointments`);
  },

  getPatientUpcomingAppointments(patientId: string) {
    return request<PublicAppointment[]>(`/patients/${patientId}/appointments/upcoming`);
  },

  createPatientAppointment(
    patientId: string,
    payload: CreateAppointmentPayload,
  ) {
    return request<PublicAppointment>(`/patients/${patientId}/appointments`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updatePatientAppointment(
    patientId: string,
    appointmentId: string,
    payload: UpdateAppointmentPayload,
  ) {
    return request<PublicAppointment>(
      `/patients/${patientId}/appointments/${appointmentId}`,
      { method: 'PATCH', body: JSON.stringify(payload) },
    );
  },

  cancelPatientAppointment(
    patientId: string,
    appointmentId: string,
    cancelReason: string,
  ) {
    return request<PublicAppointment>(
      `/patients/${patientId}/appointments/${appointmentId}/cancel`,
      { method: 'POST', body: JSON.stringify({ cancelReason }) },
    );
  },

  changePatientAppointmentState(
    patientId: string,
    appointmentId: string,
    state: 'Completed' | 'No show',
  ) {
    return request<PublicAppointment>(
      `/patients/${patientId}/appointments/${appointmentId}/state`,
      { method: 'PATCH', body: JSON.stringify({ state }) },
    );
  },

  deletePatientAppointment(patientId: string, appointmentId: string) {
    return request<void>(`/patients/${patientId}/appointments/${appointmentId}`, {
      method: 'DELETE',
    });
  },

  // --- Medicamentos ---

  getPatientMedications(patientId: string) {
    return request<PublicMedication[]>(`/patients/${patientId}/medications`);
  },

  createPatientMedication(patientId: string, payload: CreateMedicationPayload) {
    return request<PublicMedication>(`/patients/${patientId}/medications`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updatePatientMedication(
    patientId: string,
    medicationId: string,
    payload: UpdateMedicationPayload,
  ) {
    return request<PublicMedication>(
      `/patients/${patientId}/medications/${medicationId}`,
      { method: 'PATCH', body: JSON.stringify(payload) },
    );
  },

  deletePatientMedication(patientId: string, medicationId: string) {
    return request<void>(`/patients/${patientId}/medications/${medicationId}`, {
      method: 'DELETE',
    });
  },

  // --- Recordatorios ---

  getMyReminders(windowDays?: number) {
    return request<PublicReminder[]>(withQuery('/patients/me/reminders', { windowDays }));
  },

  getPatientReminders(patientId: string, windowDays?: number) {
    return request<PublicReminder[]>(
      withQuery(`/patients/${patientId}/reminders`, { windowDays }),
    );
  },

  getPatientIpcp(patientId: string) {
    return request<PublicIpcp>(`/patients/${patientId}/ipcp`);
  },
};
