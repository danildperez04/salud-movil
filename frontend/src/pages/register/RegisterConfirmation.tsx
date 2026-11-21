import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { MaskedCard } from "../../components/register/MaskedCard";
import { getButtonClassName } from "../../components/ui/buttonStyles";
import { formatCordobas } from "../../lib/format";
import { isMembershipReceipt } from "../../lib/membership";
import { PLANS } from "../../lib/plans";
import { useRegisterStore } from "../../store/register";

/**
 * Último paso del registro: avisa que la membresía quedó completa y que el
 * administrador enviará la contraseña al correo para entrar al sistema.
 *
 * El resultado llega en el `state` de la navegación (ver `MembershipReceipt`),
 * no del borrador del registro. Por eso esta pantalla no se ve afectada por
 * limpiar el borrador al salir, y por eso, si se abre escribiendo la URL (sin
 * haber completado nada), se vuelve al principio en lugar de mostrar un
 * resultado inventado.
 */
export default function RegisterConfirmation() {
  const { state } = useLocation();
  const reset = useRegisterStore((s) => s.reset);

  if (!isMembershipReceipt(state)) {
    return <Navigate to="/registro" replace />;
  }
  const plan = PLANS[state.planId];

  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-soft">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-mint-soft text-primary">
          <CheckCircle2 size={32} aria-hidden="true" />
        </span>
        <h1 className="font-display text-xl font-bold text-navy">
          ¡Membresía completada!
        </h1>
        <p className="font-body text-sm text-primary-dark">
          El administrador te enviará la contraseña a{" "}
          <strong className="break-words font-semibold text-navy">
            {state.email}
          </strong>{" "}
          para que puedas ingresar al sistema.
        </p>
      </div>

      <dl className="mt-6 flex flex-col gap-3 rounded-xl border border-line bg-mint-soft-2 p-4">
        <SummaryRow label="Plan">{plan.name}</SummaryRow>
        <SummaryRow label="Mensualidad">
          {formatCordobas(plan.monthlyPrice)}
        </SummaryRow>
        <SummaryRow label="Tarjeta">
          <MaskedCard brand={state.brand} last4={state.last4} />
        </SummaryRow>
      </dl>

      {/* El borrador se limpia al salir, no al llegar: así, si la persona
          vuelve atrás desde aquí, todavía encuentra su tarjeta. */}
      <Link
        to="/login"
        onClick={reset}
        className={getButtonClassName("primary", "mt-6 w-full")}
      >
        Ir al inicio de sesión
      </Link>
    </div>
  );
}

function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="font-body text-xs uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="text-right font-body text-sm font-semibold text-navy">
        {children}
      </dd>
    </div>
  );
}
