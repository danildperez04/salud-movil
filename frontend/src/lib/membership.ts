import { isCardBrand } from './cards';
import type { CardBrand, PaymentMethod } from './cards';
import { isPlanId } from './plans';
import type { PlanId } from './plans';

/**
 * Lo que la pantalla de confirmación necesita para mostrar el resultado del
 * registro. Viaja en el `state` de la navegación y no en la URL: el correo no
 * debe quedar en la barra de direcciones ni en el historial de enlaces. A
 * diferencia de un estado en memoria, el `state` sobrevive a un refresco de la
 * página, y no depende del borrador del registro, que se limpia al salir.
 */
export interface MembershipReceipt {
  email: string;
  planId: PlanId;
  brand: CardBrand;
  last4: string;
}

export function toReceipt(
  email: string,
  planId: PlanId,
  method: PaymentMethod,
): MembershipReceipt {
  return { email, planId, brand: method.brand, last4: method.last4 };
}

/**
 * `location.state` puede ser cualquier cosa (o nada, si se entra a la
 * confirmación escribiendo la URL), así que se valida antes de usarlo.
 */
export function isMembershipReceipt(value: unknown): value is MembershipReceipt {
  if (typeof value !== 'object' || value === null) return false;
  const { email, planId, brand, last4 } = value as Record<string, unknown>;
  return (
    typeof email === 'string' &&
    isPlanId(planId) &&
    isCardBrand(brand) &&
    typeof last4 === 'string'
  );
}
