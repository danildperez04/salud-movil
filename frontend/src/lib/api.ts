import type {
  AuthResponse,
  CatalogueItem,
  CreateMedicalVisitPayload,
  CreatePatientPayload,
  CreateStaffPayload,
  HealthCenterItem,
  LinkCaregiverPayload,
  MunicipalityItem,
  PublicCaregiver,
  PublicCaregiverLink,
  PublicMedicalRecord,
  PublicPatient,
  PublicStaff,
  UpdateMedicalRecordPayload,
  UpdatePatientPayload,
  UpdateStaffPayload,
} from '../types';

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

let tokenGetter: () => string | null = () => null;

export function setTokenGetter(getter: () => string | null) {
  tokenGetter = getter;
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
  return text ? (JSON.parse(text) as T) : (undefined as T);
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
};
