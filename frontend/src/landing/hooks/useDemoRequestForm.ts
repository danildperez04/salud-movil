import { useState } from "react";
import { ApiError, api } from "../../lib/api";

export type DemoField =
  | "name"
  | "email"
  | "organization"
  | "jobTitle"
  | "phoneNumber"
  | "message";

type Values = Record<DemoField, string>;
type Errors = Partial<Record<DemoField, string>>;
type Status = "idle" | "submitting" | "success";

const EMPTY: Values = {
  name: "",
  email: "",
  organization: "",
  jobTitle: "",
  phoneNumber: "",
  message: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Igual que el API: un "+" o dígito inicial y entre 7 y 29 caracteres.
const PHONE = /^[+\d][\d\s().-]{6,28}$/;

// Mismas reglas que el API (CreateDemoRequestDto): así los errores salen antes
// de la petición, pero el servidor sigue siendo quien decide.
function validate(values: Values): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  const organization = values.organization.trim();
  const phone = values.phoneNumber.trim();

  if (name.length < 2) errors.name = "Escribe tu nombre completo.";
  if (!EMAIL.test(values.email.trim())) {
    errors.email = "Ingresa un correo válido.";
  }
  if (organization.length < 2) {
    errors.organization = "Indica tu institución u organización.";
  }
  if (phone && !PHONE.test(phone)) {
    errors.phoneNumber = "Ingresa un teléfono válido.";
  }
  return errors;
}

export function useDemoRequestForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const setValue = (field: DemoField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    // El error de un campo se quita en cuanto la persona lo corrige.
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  /** `decoy` es el valor del campo señuelo; en una persona siempre va vacío. */
  const submit = async (decoy: string) => {
    if (status === "submitting") return;
    setFormError(null);

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("submitting");
    try {
      await api.createDemoRequest({
        name: values.name.trim(),
        email: values.email.trim(),
        organization: values.organization.trim(),
        jobTitle: values.jobTitle.trim() || undefined,
        phoneNumber: values.phoneNumber.trim() || undefined,
        message: values.message.trim() || undefined,
        website: decoy || undefined,
      });
      setValues(EMPTY);
      setStatus("success");
    } catch (error) {
      setStatus("idle");
      setFormError(
        error instanceof ApiError && error.statusCode === 429
          ? "Has enviado demasiadas solicitudes. Inténtalo de nuevo más tarde."
          : error instanceof ApiError && error.statusCode !== 0
            ? error.message
            : "No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.",
      );
    }
  };

  const reset = () => {
    setStatus("idle");
    setFormError(null);
    setErrors({});
  };

  return { values, errors, status, formError, setValue, submit, reset };
}
