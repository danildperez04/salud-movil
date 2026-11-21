import { Link, Navigate } from "react-router";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { CardBrandIcon } from "../../components/register/CardBrandIcon";
import { MembershipPanel } from "../../components/register/MembershipPanel";
import {
  CARD_BRAND_LABELS,
  CARD_NUMBER_LENGTH,
  CVV_LENGTH,
} from "../../lib/cards";
import { PLANS } from "../../lib/plans";
import { useRegisterStore } from "../../store/register";
import type { RegisterDraft } from "../../store/register";
import { useCardForm } from "./useCardForm";

/**
 * Pantalla propia para agregar una tarjeta de débito: titular, número,
 * vencimiento y código de seguridad. Al guardarla, el registro queda completo
 * y se pasa a la confirmación (ver `useCompleteRegistration`).
 *
 * La lógica (formato, validación, envío) está en `useCardForm`. Igual que el
 * paso anterior, sin un plan elegido se vuelve al principio.
 */
export default function RegisterCard() {
  const draft = useRegisterStore((s) => s.draft);

  if (!draft) {
    return <Navigate to="/registro" replace />;
  }
  return <CardStep draft={draft} />;
}

function CardStep({ draft }: { draft: RegisterDraft }) {
  const { values, errors, brand, setValue, handleSubmit } = useCardForm(draft);

  return (
    <div className="grid w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-white shadow-soft md:grid-cols-2">
      <MembershipPanel plan={PLANS[draft.planId]} email={draft.email} />

      <div className="p-8">
        <Link
          to="/registro/pago"
          className="inline-flex items-center gap-1 font-body text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Volver
        </Link>

        <p className="mt-4 font-body text-xs font-semibold uppercase tracking-wide text-primary-dark">
          Paso 2 de 2
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy">
          Agregar tarjeta de débito
        </h1>
        <p className="mb-6 mt-1 font-body text-sm text-muted">
          Aceptamos tarjetas de débito Visa y Mastercard.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          <Input
            label="Nombre del titular"
            value={values.holder}
            onChange={(event) => setValue("holder", event.target.value)}
            placeholder="Como aparece en la tarjeta"
            autoComplete="cc-name"
            error={errors.holder}
            autoFocus
          />
          <Input
            label="Número de tarjeta"
            // El logo reemplaza al texto, así que el nombre de la red va aparte
            // para quien usa lector de pantalla. 20 px: lo que mide el texto
            // del label, para que el campo no salte al aparecer.
            labelSlot={
              brand ? (
                <span className="flex items-center">
                  <CardBrandIcon brand={brand} size={20} />
                  <span className="sr-only">{CARD_BRAND_LABELS[brand]}</span>
                </span>
              ) : null
            }
            value={values.number}
            onChange={(event) => setValue("number", event.target.value)}
            placeholder="0000 0000 0000 0000"
            inputMode="numeric"
            autoComplete="cc-number"
            // 16 dígitos y los 3 espacios que les pone `formatCardNumber`.
            maxLength={CARD_NUMBER_LENGTH + 3}
            error={errors.number}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Vencimiento"
              value={values.expiry}
              onChange={(event) => setValue("expiry", event.target.value)}
              placeholder="MM/AA"
              inputMode="numeric"
              autoComplete="cc-exp"
              maxLength={5}
              error={errors.expiry}
            />
            <Input
              label="Código (CVV)"
              type="password"
              value={values.cvv}
              onChange={(event) => setValue("cvv", event.target.value)}
              placeholder="•••"
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={CVV_LENGTH}
              error={errors.cvv}
            />
          </div>

          <Button type="submit" className="mt-2 w-full">
            <Lock size={16} aria-hidden="true" /> Completar membresía
          </Button>
        </form>

        <p className="mt-4 flex items-start gap-2 font-body text-xs text-muted">
          <ShieldCheck
            size={14}
            aria-hidden="true"
            className="mt-0.5 shrink-0"
          />
          <span>
            Tu número completo y tu código de seguridad no se almacenan.
          </span>
        </p>
      </div>
    </div>
  );
}
