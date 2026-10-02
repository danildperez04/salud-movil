import { useEffect, useState } from "react";
import { useCatalogueStore } from "../store/catalogues";

/**
 * Encapsula el patrón "departamento → municipio" repetido en el formulario
 * de pacientes y el de cuidadores:
 *  - carga los departamentos al montar,
 *  - filtra los municipios del departamento elegido,
 *  - sabe "hidratarse" en modo edición: dado el municipio ya guardado del
 *    registro, ubica a qué departamento pertenece y precarga sus municipios.
 */
export function useLocationSelect() {
  const departments = useCatalogueStore((s) => s.departments);
  const loadDepartments = useCatalogueStore((s) => s.loadDepartments);
  const municipalities = useCatalogueStore((s) => s.municipalities);
  const loadMunicipalities = useCatalogueStore((s) => s.loadMunicipalities);
  const loadAllMunicipalities = useCatalogueStore(
    (s) => s.loadAllMunicipalities,
  );

  const [departmentId, setDepartmentId] = useState("");

  useEffect(() => {
    void loadDepartments();
  }, [loadDepartments]);

  /**
   * Cambia de departamento y recarga sus municipios. `onDepartmentChanged`
   * es el hook de escape para que el formulario dueño limpie el
   * `municipalityId` que tenga en su propio estado (el municipio elegido no
   * necesariamente pertenece al nuevo departamento).
   */
  async function handleDepartmentChange(
    value: string,
    onDepartmentChanged?: () => void,
  ) {
    setDepartmentId(value);
    onDepartmentChanged?.();
    if (value) {
      await loadMunicipalities(Number(value));
    }
  }

  /** Modo edición: ubica el departamento de un municipio ya guardado. */
  async function hydrateFromMunicipality(municipalityId: number) {
    if (useCatalogueStore.getState().allMunicipalities.length === 0) {
      await loadAllMunicipalities();
    }
    const list = useCatalogueStore.getState().allMunicipalities;
    const match = list.find(
      (municipality) => municipality.id === municipalityId,
    );
    if (match) {
      setDepartmentId(String(match.departmentId));
      await loadMunicipalities(match.departmentId);
    }
  }

  const municipalityOptions = departmentId
    ? (municipalities[Number(departmentId)] ?? [])
    : [];

  return {
    departments,
    departmentId,
    municipalityOptions,
    handleDepartmentChange,
    hydrateFromMunicipality,
  };
}
