import { FaCcMastercard, FaCcVisa } from "react-icons/fa6";
import type { IconType } from "react-icons";
import type { CardBrand } from "../../lib/cards";

const ICONS: Record<CardBrand, IconType> = {
  visa: FaCcVisa,
  mastercard: FaCcMastercard,
};

/**
 * Logo de la red de la tarjeta. Va en el azul de marca y no en los colores de
 * cada red, para que no entren a la pantalla colores ajenos a la paleta.
 *
 * Es decorativo: el nombre de la red siempre aparece también como texto
 * ("Visa •••• 4242"), o lo pone quien lo usa como `sr-only`.
 */
export function CardBrandIcon({
  brand,
  size = 28,
}: {
  brand: CardBrand;
  size?: number;
}) {
  const Icon = ICONS[brand];
  return <Icon size={size} className="shrink-0 text-navy" aria-hidden="true" />;
}
