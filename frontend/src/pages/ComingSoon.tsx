import { Construction } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

/**
 * Placeholder para rutas del sidebar que ya están en el menú pero cuya
 * pantalla todavía no está construida. Úsalo así en App.tsx:
 *   <Route path="priority" element={<ComingSoon title="Prioridad IPCP" />} />
 * y reemplázalo por la página real cuando esté lista, sin tocar el sidebar.
 */
export default function ComingSoon({
  title,
  description = "Estamos trabajando en esta sección. Pronto estará disponible.",
}: ComingSoonProps) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-mint-soft text-primary">
        <Construction size={28} aria-hidden="true" />
      </span>
      <div>
        <h1 className="font-display text-xl font-bold text-navy">{title}</h1>
        <p className="mt-1 max-w-sm font-body text-sm text-muted">
          {description}
        </p>
      </div>
    </div>
  );
}
