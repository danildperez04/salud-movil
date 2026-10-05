export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary/30",
  secondary:
    "bg-white text-navy border border-line hover:bg-surface focus-visible:ring-primary/20",
  ghost:
    "bg-transparent text-primary hover:bg-mint-soft focus-visible:ring-primary/20",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/30",
};

/**
 * Clases visuales de un botón de marca. Se exporta para poder aplicarlas a
 * elementos que no son <button> (ej. un <a> de WhatsApp o "tel:") y que
 * deben verse exactamente igual a un botón real, sin duplicar los estilos.
 *
 * Vive en su propio archivo (y no en Button.tsx) porque un archivo de
 * componente solo puede exportar componentes: si este helper se exportara
 * junto a <Button />, Vite ya no podría aplicar Fast Refresh a ese archivo
 * (regla `react-refresh/only-export-components`).
 */
export function getButtonClassName(
  variant: ButtonVariant = "primary",
  className = "",
) {
  return `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-display text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${className}`;
}
