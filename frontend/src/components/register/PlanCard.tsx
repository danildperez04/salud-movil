import { Check, Sparkles, X } from "lucide-react";
import { Button } from "../ui/Button";
import { formatCordobas } from "../../lib/format";
import { getPlanFeatures } from "../../lib/plans";
import type { Plan, PlanId } from "../../lib/plans";

interface PlanCardProps {
  plan: Plan;
  onSelect: (planId: PlanId) => void;
}

/**
 * Tarjeta de un plan en la pantalla de elección. Lista las mismas
 * características que el resto de planes (ver `PLAN_FEATURES`), marcando con
 * una X las que este no incluye, para que la diferencia se vea sin comparar
 * textos.
 */
export function PlanCard({ plan, onSelect }: PlanCardProps) {
  const headingId = `plan-${plan.id}`;

  return (
    <article
      aria-labelledby={headingId}
      className={`relative flex flex-col rounded-2xl border bg-white p-5 sm:p-6 ${
        plan.featured ? "border-primary shadow-brand" : "border-line"
      }`}
    >
      {plan.featured ? (
        <span className="absolute -top-3 right-5 inline-flex items-center gap-1 rounded-full border border-mint-line bg-mint-soft px-3 py-1 font-body text-xs font-semibold text-primary-dark">
          <Sparkles size={12} aria-hidden="true" /> Más completo
        </span>
      ) : null}

      <h2 id={headingId} className="font-display text-xl font-bold text-navy">
        {plan.name}
      </h2>
      <p className="mt-1 font-body text-sm text-muted">{plan.description}</p>

      <p className="mt-5 flex items-baseline gap-1.5">
        <span className="font-display text-3xl font-bold text-navy">
          {formatCordobas(plan.monthlyPrice)}
        </span>
        <span className="font-body text-sm text-muted">al mes</span>
      </p>

      <ul className="mt-5 flex flex-1 flex-col gap-2.5 border-t border-line pt-5">
        {getPlanFeatures(plan.id).map(({ label, included, detail }) => (
          <li
            key={label}
            className={`flex items-start gap-2 font-body text-sm ${
              included ? "text-text" : "text-muted"
            }`}
          >
            {included ? (
              <Check
                size={16}
                className="mt-0.5 shrink-0 text-primary"
                aria-hidden="true"
              />
            ) : (
              <X size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            )}
            <span>
              {/* El icono solo no basta para quien usa lector de pantalla. */}
              <span className="sr-only">
                {included ? "Incluye: " : "No incluye: "}
              </span>
              {label}
              {detail ? (
                <>
                  : <span className="font-semibold text-navy">{detail}</span>
                </>
              ) : null}
            </span>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant={plan.featured ? "primary" : "secondary"}
        className="mt-6 w-full"
        onClick={() => onSelect(plan.id)}
      >
        Elegir plan {plan.name}
      </Button>
    </article>
  );
}
