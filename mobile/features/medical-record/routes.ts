// features/medical-record/routes.ts
// Destinos de navegación del feature, en un solo lugar para no repetir strings.
import type { Href } from 'expo-router';
import type { DocumentCategory } from './domain/record-catalogs';

const BASE = '/(app)/medical-record';

export const recordRoutes = {
  home: BASE as Href,
  summary: `${BASE}/summary` as Href,
  diagnosis: `${BASE}/diagnosis` as Href,
  newDiagnosis: `${BASE}/diagnosis/new` as Href,
  history: `${BASE}/history` as Href,
  newHistoryEntry: `${BASE}/history/new` as Href,
  allergies: `${BASE}/allergies` as Href,
  newAllergy: `${BASE}/allergies/new` as Href,
  documents: `${BASE}/documents` as Href,
  documentCategory: (category: DocumentCategory): Href => `${BASE}/documents/category/${category}`,
  document: (id: string): Href => `${BASE}/documents/${id}`,
  /** `category` preselecciona el tipo de documento en el formulario */
  uploadDocument: (category?: DocumentCategory): Href => ({
    pathname: `${BASE}/documents/upload`,
    params: category ? { category } : {},
  }),
  labs: `${BASE}/labs` as Href,
  scanLab: `${BASE}/labs/scan` as Href,
  lab: (id: string): Href => `${BASE}/labs/${id}`,
};
