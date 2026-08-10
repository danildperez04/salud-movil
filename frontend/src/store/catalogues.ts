import { create } from 'zustand';
import { api } from '../lib/api';
import type { CatalogueItem, HealthCenterItem, MunicipalityItem } from '../types';

interface CatalogueState {
  departments: CatalogueItem[];
  municipalities: Record<number, MunicipalityItem[]>;
  allMunicipalities: MunicipalityItem[];
  genres: CatalogueItem[];
  relationshipTypes: CatalogueItem[];
  majors: CatalogueItem[];
  healthCenters: HealthCenterItem[];
  loaded: boolean;
  loadAll: () => Promise<void>;
  loadDepartments: () => Promise<void>;
  loadMunicipalities: (departmentId: number) => Promise<void>;
  loadAllMunicipalities: () => Promise<void>;
  loadGenres: () => Promise<void>;
  loadRelationshipTypes: () => Promise<void>;
  loadMajors: () => Promise<void>;
  loadHealthCenters: () => Promise<void>;
}

export const useCatalogueStore = create<CatalogueState>()((set, get) => ({
  departments: [],
  municipalities: {},
  allMunicipalities: [],
  genres: [],
  relationshipTypes: [],
  majors: [],
  healthCenters: [],
  loaded: false,

  loadAll: async () => {
    if (get().loaded) {
      return;
    }
    const departments = await api.getDepartments();
    set({
      departments,
      loaded: true,
    });
    await Promise.all([
      get().loadGenres(),
      get().loadRelationshipTypes(),
      get().loadMajors(),
      get().loadHealthCenters(),
    ]);
  },

  loadDepartments: async () => {
    const departments = await api.getDepartments();
    set({ departments });
  },

  loadMunicipalities: async (departmentId: number) => {
    const existing = get().municipalities[departmentId];
    if (existing) {
      return;
    }
    const municipalities = await api.getMunicipalities(departmentId);
    set((state) => ({
      municipalities: { ...state.municipalities, [departmentId]: municipalities },
    }));
  },

  loadAllMunicipalities: async () => {
    if (get().allMunicipalities.length > 0) {
      return;
    }
    const allMunicipalities = await api.getMunicipalities();
    set({ allMunicipalities });
  },

  loadGenres: async () => {
    const genres = await api.getGenres();
    set({ genres });
  },

  loadRelationshipTypes: async () => {
    const relationshipTypes = await api.getRelationshipTypes();
    set({ relationshipTypes });
  },

  loadMajors: async () => {
    const majors = await api.getMajors();
    set({ majors });
  },

  loadHealthCenters: async () => {
    const healthCenters = await api.getHealthCenters();
    set({ healthCenters });
  },
}));
