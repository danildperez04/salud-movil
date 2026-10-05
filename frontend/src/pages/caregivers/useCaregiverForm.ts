import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { api, ApiError } from "../../lib/api";
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
};

export type CaregiverFormValue = typeof EMPTY_FORM;

/**
 * Toda la lógica de CaregiverForm (estado, carga en modo edición, envío)
 * vive aquí, igual que usePatientForm en la carpeta de pacientes.
 */
export function useCaregiverForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const {
    departments,
    departmentId,
    municipalityOptions,
    handleDepartmentChange,
    hydrateFromMunicipality,
  } = useLocationSelect();

  const [form, setForm] = useState<CaregiverFormValue>(EMPTY_FORM);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof CaregiverFormValue>(
    key: K,
    value: CaregiverFormValue[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  useEffect(() => {
    if (!isEditing || !id) {
      return;
    }
    const userId = id;
    let cancelled = false;
    async function loadCaregiver() {
      try {
        const user = await api.getCaregiver(userId);
        if (cancelled) {
          return;
        }
        setForm((previous) => ({
          ...previous,
          name: user.name,
          email: user.email,
          username: user.username,
          phoneNumber: user.phoneNumber,
          address: user.address,
          dni: user.dni ?? "",
          municipalityId: String(user.municipalityId ?? ""),
        }));
        setIsActive(user.isActive);
        if (user.municipalityId) {
          await hydrateFromMunicipality(user.municipalityId);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudo cargar el cuidador",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void loadCaregiver();
    return () => {
      cancelled = true;
    };
    // hydrateFromMunicipality no está memoizada; ver la misma nota en
    // usePatientForm.ts.
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
          isActive,
        };
        if (form.dni) {
          payload.dni = form.dni;
        }
        if (form.password) {
          payload.password = form.password;
        }
        await api.updateCaregiver(id, payload);
      } else {
        await api.createCaregiver({
          name: form.name,
          email: form.email,
          username: form.username,
          password: form.password,
          phoneNumber: form.phoneNumber,
          address: form.address,
          dni: form.dni || undefined,
          municipalityId: Number(form.municipalityId),
        });
      }
      navigate("/app/caregivers", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo guardar el cuidador",
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    isEditing,
    form,
    updateField,
    isActive,
    setIsActive,
    loading,
    saving,
    error,
    departments,
    departmentId,
    municipalityOptions,
    handleDepartmentChange,
    handleSubmit,
  };
}
