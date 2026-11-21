import { useState } from "react";
import type { FormEvent } from "react";
import {
  CVV_LENGTH,
  CARD_NUMBER_LENGTH,
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  isExpired,
  isValidLuhn,
  onlyDigits,
  parseExpiry,
} from "../../lib/cards";
import type { NewPaymentMethod } from "../../lib/cards";
import { useRegisterStore } from "../../store/register";
import type { RegisterDraft } from "../../store/register";
import { useCompleteRegistration } from "./useCompleteRegistration";

export type CardField = "holder" | "number" | "expiry" | "cvv";

type Values = Record<CardField, string>;
type Errors = Partial<Record<CardField, string>>;

const EMPTY: Values = { holder: "", number: "", expiry: "", cvv: "" };

// Letras (con tildes y ñ), espacios, apóstrofo, punto y guion; al menos tres.
const HOLDER = /^\p{L}[\p{L}\s'.-]{2,}$/u;

/** Da formato a lo escrito en cada campo, para que quede como se lee en la tarjeta. */
function format(field: CardField, raw: string): string {
  switch (field) {
    case "number":
      return formatCardNumber(raw);
    case "expiry":
      return formatExpiry(raw);
    case "cvv":
      return onlyDigits(raw).slice(0, CVV_LENGTH);
    default:
      return raw;
  }
}

type Parsed =
  | { ok: true; card: NewPaymentMethod }
  | { ok: false; errors: Errors };

/**
 * Valida el formulario y, si todo está bien, devuelve la tarjeta ya
 * enmascarada: de aquí sale `last4`, nunca el número completo ni el código de
 * seguridad.
 */
function parseCard(values: Values): Parsed {
  const errors: Errors = {};
  const holder = values.holder.trim();
  const digits = onlyDigits(values.number);
  const brand = detectCardBrand(digits);
  const expiry = parseExpiry(values.expiry);

  if (!HOLDER.test(holder)) {
    errors.holder = "Escribe el nombre como aparece en la tarjeta.";
  }

  if (!digits) {
    errors.number = "Ingresa el número de tarjeta.";
  } else if (!brand) {
    errors.number = "Solo aceptamos tarjetas Visa y Mastercard.";
  } else if (digits.length !== CARD_NUMBER_LENGTH || !isValidLuhn(digits)) {
    errors.number = "El número de tarjeta no es válido.";
  }

  if (!values.expiry) {
    errors.expiry = "Ingresa el vencimiento.";
  } else if (!expiry) {
    errors.expiry = "Ingresa una fecha válida (MM/AA).";
  } else if (isExpired(expiry)) {
    errors.expiry = "La tarjeta está vencida.";
  }

  if (values.cvv.length !== CVV_LENGTH) {
    errors.cvv = `Ingresa los ${CVV_LENGTH} dígitos.`;
  }

  // `brand` y `expiry` ya se comprobaron arriba; se repiten aquí solo para que
  // TypeScript sepa que no son `null` al armar la tarjeta.
  if (Object.keys(errors).length > 0 || !brand || !expiry) {
    return { ok: false, errors };
  }
  return {
    ok: true,
    card: {
      brand,
      last4: digits.slice(-4),
      holder,
      expMonth: expiry.month,
      expYear: expiry.year,
    },
  };
}

/**
 * Estado, formato y envío del formulario de tarjeta de débito. Toda la lógica
 * vive aquí y `RegisterCard` solo pinta, igual que `usePatientForm` con el
 * formulario de pacientes.
 */
export function useCardForm(draft: RegisterDraft) {
  const addPaymentMethod = useRegisterStore((s) => s.addPaymentMethod);
  const completeRegistration = useCompleteRegistration(draft);

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  // Se deriva en cada render: es el logo que acompaña al campo del número.
  const brand = detectCardBrand(onlyDigits(values.number));

  function setValue(field: CardField, raw: string) {
    setValues((current) => ({ ...current, [field]: format(field, raw) }));
    // El error de un campo se quita en cuanto la persona lo corrige.
    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = parseCard(values);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    completeRegistration(addPaymentMethod(result.card));
  }

  return { values, errors, brand, setValue, handleSubmit };
}
