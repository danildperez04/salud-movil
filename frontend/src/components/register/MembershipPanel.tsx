import { Mail } from "lucide-react";
import { Logo } from "../ui/Logo";
import { formatCordobas } from "../../lib/format";
import type { Plan } from "../../lib/plans";

interface MembershipPanelProps {
  plan: Plan;
  email: string;
}

/**
 * Panel izquierdo de los pasos de pago del registro: la identidad de marca de
 * siempre (igual que en el login) y, abajo, un resumen de lo que se está
 * contratando, para que quien paga vea el plan y el correo en cada paso.
 */
export function MembershipPanel({ plan, email }: MembershipPanelProps) {
  return (
    <div className="flex flex-col justify-between bg-linear-to-br from-mint-soft to-white p-8">
      <div>
        <Logo />
        <p className="mt-1 font-body text-sm text-muted">
          Tu salud, en tus manos
        </p>
      </div>

      <div className="mt-10">
        <p className="font-body text-xs font-semibold uppercase tracking-wide text-muted">
          Tu membresía
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold text-navy">
          Plan {plan.name}
        </h2>
        <p className="mt-1 font-body text-sm text-muted">
          {formatCordobas(plan.monthlyPrice)} al mes
        </p>
        <p className="mt-4 flex items-start gap-2 font-body text-sm text-navy">
          <Mail
            size={16}
            className="mt-0.5 shrink-0 text-primary"
            aria-hidden="true"
          />
          {/* `min-w-0` deja que el correo se encoja dentro del flex y
              `break-words` lo parte en un guion si hace falta, sin
              deshacerlo letra por letra como haría `break-all`. */}
          <span className="min-w-0 break-words">{email}</span>
        </p>
      </div>
    </div>
  );
}
