import { useNavigate } from "react-router";
import type { PaymentMethod } from "../../lib/cards";
import { toReceipt } from "../../lib/membership";
import type { RegisterDraft } from "../../store/register";

/**
 * Cierra el registro con la tarjeta elegida y lleva a la confirmación.
 *
 * Es el único sitio donde el registro "termina": lo usan tanto la lista de
 * métodos de pago (al elegir una tarjeta ya registrada) como el formulario de
 * tarjeta nueva. Así el final del flujo no se duplica y, cuando exista el
 * endpoint de membresías, la llamada a la API va aquí, antes de navegar.
 */
export function useCompleteRegistration(draft: RegisterDraft) {
  const navigate = useNavigate();

  return function completeRegistration(method: PaymentMethod) {
    navigate("/registro/confirmacion", {
      // `replace`: el botón "atrás" de la confirmación no debe reabrir el
      // formulario de tarjeta que acaba de enviarse.
      replace: true,
      state: toReceipt(draft.email, draft.planId, method),
    });
  };
}
