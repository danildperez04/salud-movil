import { create } from 'zustand';
import type { NewPaymentMethod, PaymentMethod } from '../lib/cards';
import type { PlanId } from '../lib/plans';

/** Lo que se decide en el primer paso del registro. */
export interface RegisterDraft {
  email: string;
  planId: PlanId;
}

interface RegisterState {
  draft: RegisterDraft | null;
  paymentMethods: PaymentMethod[];
  selectedMethodId: string | null;
  /** Guarda el correo y el plan elegidos en el paso 1. */
  start: (email: string, planId: PlanId) => void;
  /** Registra una tarjeta, la deja elegida y la devuelve. */
  addPaymentMethod: (method: NewPaymentMethod) => PaymentMethod;
  selectPaymentMethod: (id: string) => void;
  reset: () => void;
}

const EMPTY = {
  draft: null,
  paymentMethods: [],
  selectedMethodId: null,
};

/** Ids locales; no hace falta un UUID porque nada de esto sale del navegador. */
let nextMethodId = 1;

/**
 * Borrador del registro de membresía (`/registro`), que reparte el estado entre
 * sus pantallas.
 *
 * Sin backend: vive solo en memoria y no se persiste a propósito. Así no queda
 * en el navegador ningún dato de una tarjeta ni el correo de quien se registró,
 * y refrescar la página lleva de nuevo al primer paso (las pantallas
 * siguientes lo comprueban). Cuando exista el endpoint, el envío va en
 * `useCompleteRegistration`.
 */
export const useRegisterStore = create<RegisterState>()((set) => ({
  ...EMPTY,

  start: (email, planId) =>
    set((state) => {
      // Las tarjetas son de quien se registra, no del plan: si vuelve al paso 1
      // y cambia de plan conserva las suyas, pero con otro correo empieza limpio.
      const sameOwner =
        state.draft?.email.toLowerCase() === email.toLowerCase();
      return sameOwner
        ? { draft: { email, planId } }
        : { ...EMPTY, draft: { email, planId } };
    }),

  addPaymentMethod: (method) => {
    const created: PaymentMethod = { ...method, id: `pm-${nextMethodId++}` };
    set((state) => ({
      paymentMethods: [...state.paymentMethods, created],
      selectedMethodId: created.id,
    }));
    return created;
  },

  selectPaymentMethod: (id) => set({ selectedMethodId: id }),

  reset: () => set(EMPTY),
}));
