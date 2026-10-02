import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { api, ApiError } from "../../lib/api";
import { useCatalogueStore } from "../../store/catalogues";
import { useAuthStore } from "../../store/auth";
import { useLocationSelect } from "../../hooks/useLocationSelect";

const EMPTY_FORM = {
  name: "",
  email: "",
  username: "",
  password: "",
  phoneNumber: "",
  address: "",
  dni: "",
  municipalityId: "",
  dateOfBirth: "",
  genreId: "",
  emergencyContactName: "",
  emergencyContactPhoneNumber: "",
  healthCenterId: "",
};

export type PatientFormValue = typeof EMPTY_FORM;

/**
 * Toda la lógica de PatientForm (estado, carga en modo edición, envío) vive
 * aquí. El componente solo llama a este hook y renderiza JSX: así el archivo
 * de la página no crece cada vez que se agrega un campo o una regla de
 * negocio nueva.
 */
export function usePatientForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const isAdmin = currentUser?.role === "admin";

  const {
    departments,
    departmentId,
    municipalityOptions,
    handleDepartmentChange,
    hydrateFromMunicipality,
  } = useLocationSelect();

  const genres = useCatalogueStore((s) => s.genres);
  const loadGenres = useCatalogueStore((s) => s.loadGenres);
  const healthCenters = useCatalogueStore((s) => s.healthCenters);
  const loadHealthCenters = useCatalogueStore((s) => s.loadHealthCenters);

  const [form, setForm] = useState<PatientFormValue>(EMPTY_FORM);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof PatientFormValue>(
    key: K,
    value: PatientFormValue[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  // La carga de departamentos la maneja useLocationSelect internamente.
  useEffect(() => {
    void loadGenres();
    if (isAdmin) {
      void loadHealthCenters();
    }
  }, [loadGenres, loadHealthCenters, isAdmin]);

  useEffect(() => {
    if (!isEditing || !id) {
      return;
    }
    const patientId = id;
    let cancelled = false;
    async function loadPatient() {
      try {
        const patient = await api.getPatient(patientId);
        if (cancelled) {
          return;
        }
        setForm((previous) => ({
          ...previous,
          name: patient.name,
          email: patient.email,
          username: patient.username,
          phoneNumber: patient.phoneNumber,
          address: patient.address,
          dni: patient.dni ?? "",
          municipalityId: String(patient.municipalityId),
          dateOfBirth: patient.dateOfBirth.slice(0, 10),
          genreId: String(patient.genreId),
          emergencyContactName: patient.emergencyContactName,
          emergencyContactPhoneNumber: patient.emergencyContactPhoneNumber,
          healthCenterId: patient.healthCenterId,
        }));
        await hydrateFromMunicipality(patient.municipalityId);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudo cargar el paciente",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void loadPatient();
    return () => {
      cancelled = true;
    };
    // hydrateFromMunicipality no está memoizada (el hook no usa useCallback),
    // así que incluirla en las deps re-dispararía esta carga en cada render
    // en vez de solo cuando cambian `id`/`isEditing`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEditing && id) {
        const payload: Record<string, unknown> = {
          name: form.name,
          email: form.email,
          username: form.username,
          phoneNumber: form.phoneNumber,
          address: form.address,
          municipalityId: Number(form.municipalityId),
          dateOfBirth: form.dateOfBirth,
          genreId: Number(form.genreId),
          emergencyContactName: form.emergencyContactName,
          emergencyContactPhoneNumber: form.emergencyContactPhoneNumber,
        };
        if (form.dni) {
          payload.dni = form.dni;
        }
        if (form.password) {
          payload.password = form.password;
        }
        await api.updatePatient(id, payload);
      } else {
        await api.createPatient({
          name: form.name,
          email: form.email,
          username: form.username,
          password: form.password,
          phoneNumber: form.phoneNumber,
          address: form.address,
          dni: form.dni || undefined,
          municipalityId: Number(form.municipalityId),
          dateOfBirth: form.dateOfBirth,
          genreId: Number(form.genreId),
          emergencyContactName: form.emergencyContactName,
          emergencyContactPhoneNumber: form.emergencyContactPhoneNumber,
          healthCenterId: isAdmin
            ? form.healthCenterId || undefined
            : undefined,
        });
      }
      navigate("/app/patients", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo guardar el paciente",
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    isEditing,
    isAdmin,
    form,
    updateField,
    loading,
    saving,
    error,
    genres,
    healthCenters,
    departments,
    departmentId,
    municipalityOptions,
    handleDepartmentChange,
    handleSubmit,
  };
}
