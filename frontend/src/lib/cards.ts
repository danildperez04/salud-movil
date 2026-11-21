/** Redes de tarjeta de débito que acepta el registro. */
export type CardBrand = 'visa' | 'mastercard';

export const CARD_BRAND_LABELS: Record<CardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
};

export function isCardBrand(value: unknown): value is CardBrand {
  return typeof value === 'string' && Object.hasOwn(CARD_BRAND_LABELS, value);
}

/**
 * Tarjeta ya registrada, tal como se conserva en el navegador: enmascarada.
 * Del número completo y del código de seguridad no se guarda nada; solo lo que
 * hace falta para reconocerla en una lista.
 */
export interface PaymentMethod {
  id: string;
  brand: CardBrand;
  last4: string;
  holder: string;
  expMonth: number;
  /** Año completo ("2028"). */
  expYear: number;
}

export type NewPaymentMethod = Omit<PaymentMethod, 'id'>;

export const CARD_NUMBER_LENGTH = 16;
export const CVV_LENGTH = 3;

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Red de la tarjeta según los primeros dígitos, o `null` si no es Visa ni
 * Mastercard (o todavía faltan dígitos para saberlo). Visa empieza en 4;
 * Mastercard en 51-55 o en el rango 2221-2720.
 */
export function detectCardBrand(digits: string): CardBrand | null {
  if (digits.startsWith('4')) return 'visa';
  if (digits.length >= 2) {
    const prefix = Number(digits.slice(0, 2));
    if (prefix >= 51 && prefix <= 55) return 'mastercard';
  }
  if (digits.length >= 4) {
    const prefix = Number(digits.slice(0, 4));
    if (prefix >= 2221 && prefix <= 2720) return 'mastercard';
  }
  return null;
}

/** `4242424242424242` → "4242 4242 4242 4242". Descarta lo que no sea dígito. */
export function formatCardNumber(value: string): string {
  return onlyDigits(value)
    .slice(0, CARD_NUMBER_LENGTH)
    .replace(/(.{4})(?=.)/g, '$1 ');
}

/** Algoritmo de Luhn: descubre errores de digitación en el número. */
export function isValidLuhn(digits: string): boolean {
  if (digits.length === 0) return false;
  let sum = 0;
  let doubled = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubled) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubled = !doubled;
  }
  return sum % 10 === 0;
}

/**
 * Da formato "MM/AA" mientras se escribe: `0828` → "08/28". Un primer dígito
 * que ya no puede abrir un mes de dos cifras (2-9) se completa con cero: `5` →
 * "05".
 */
export function formatExpiry(value: string): string {
  let digits = onlyDigits(value).slice(0, 4);
  if (digits.length === 1 && digits > '1') digits = `0${digits}`;
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export interface CardExpiry {
  month: number;
  /** Año completo ("2028"). */
  year: number;
}

/** "MM/AA" → mes y año, o `null` si no tiene esa forma o el mes no existe. */
export function parseExpiry(value: string): CardExpiry | null {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return null;
  const month = Number(match[1]);
  if (month < 1 || month > 12) return null;
  return { month, year: 2000 + Number(match[2]) };
}

/**
 * Una tarjeta vale hasta el último día del mes que dice su vencimiento, así
 * que se compara con el primer día del mes siguiente.
 */
export function isExpired({ month, year }: CardExpiry, now = new Date()): boolean {
  return new Date(year, month, 1) <= now;
}

/** "08/28" a partir del mes y el año completo de una tarjeta guardada. */
export function formatExpiryLabel(month: number, year: number): string {
  return `${String(month).padStart(2, '0')}/${String(year % 100).padStart(2, '0')}`;
}
