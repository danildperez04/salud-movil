import { CARD_BRAND_LABELS } from "../../lib/cards";
import type { CardBrand } from "../../lib/cards";

/**
 * "Visa •••• 4242". Se pinta en línea para que quien lo use lo envuelva con su
 * propio estilo. Los puntos son decoración: un lector de pantalla dice "Visa
 * terminada en 4242" y no deletrea cuatro símbolos.
 */
export function MaskedCard({
  brand,
  last4,
}: {
  brand: CardBrand;
  last4: string;
}) {
  return (
    <>
      {CARD_BRAND_LABELS[brand]} <span aria-hidden="true">••••</span>
      <span className="sr-only"> terminada en</span> {last4}
    </>
  );
}
