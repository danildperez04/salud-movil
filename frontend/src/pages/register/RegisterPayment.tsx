import { Link, Navigate } from "react-router";
import { ArrowLeft, CreditCard, Plus } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { getButtonClassName } from "../../components/ui/buttonStyles";
import { CardBrandIcon } from "../../components/register/CardBrandIcon";
import { MaskedCard } from "../../components/register/MaskedCard";
import { MembershipPanel } from "../../components/register/MembershipPanel";
import { formatExpiryLabel } from "../../lib/cards";
import type { PaymentMethod } from "../../lib/cards";
import { PLANS } from "../../lib/plans";
import { useRegisterStore } from "../../store/register";
import type { RegisterDraft } from "../../store/register";
import { useCompleteRegistration } from "./useCompleteRegistration";

/**
 * Paso 2 del registro: los métodos de pago de la persona y la opción de
 * agregar uno.
 *
 * Sin métodos registrados solo ofrece agregar el primero. Con alguno, deja
 * elegir con cuál completar la membresía. Se llega aquí desde el paso 1; si se
 * abre la URL directamente, no hay plan elegido y se vuelve al principio.
 */
export default function RegisterPayment() {
  const draft = useRegisterStore((s) => s.draft);

  if (!draft) {
    return <Navigate to="/registro" replace />;
  }
  return <PaymentStep draft={draft} />;
}

function PaymentStep({ draft }: { draft: RegisterDraft }) {
  const paymentMethods = useRegisterStore((s) => s.paymentMethods);
  const selectedMethodId = useRegisterStore((s) => s.selectedMethodId);
  const selectPaymentMethod = useRegisterStore((s) => s.selectPaymentMethod);
  const completeRegistration = useCompleteRegistration(draft);

  const selected = paymentMethods.find((method) => method.id === selectedMethodId);

  return (
    <div className="grid w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-white shadow-soft md:grid-cols-2">
      <MembershipPanel plan={PLANS[draft.planId]} email={draft.email} />

      <div className="p-8">
        <Link
          to="/registro"
          className="inline-flex items-center gap-1 font-body text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Volver
        </Link>

        <p className="mt-4 font-body text-xs font-semibold uppercase tracking-wide text-primary-dark">
          Paso 2 de 2
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy">
          Método de pago
        </h1>
        <p className="mb-6 mt-1 font-body text-sm text-muted">
          Elige o agrega la tarjeta de débito con la que pagarás tu membresía.
        </p>

        {paymentMethods.length > 0 ? (
          <div className="flex flex-col gap-4">
            <fieldset className="flex flex-col gap-3">
              <legend className="sr-only">Tarjetas registradas</legend>
              {paymentMethods.map((method) => (
                <PaymentMethodOption
                  key={method.id}
                  method={method}
                  checked={method.id === selectedMethodId}
                  onSelect={selectPaymentMethod}
                />
              ))}
            </fieldset>

            <Link
              to="/registro/pago/nuevo"
              className={getButtonClassName("secondary", "w-full")}
            >
              <Plus size={16} aria-hidden="true" /> Agregar otro método de pago
            </Link>
            <Button
              type="button"
              className="mt-2 w-full"
              disabled={!selected}
              onClick={() => selected && completeRegistration(selected)}
            >
              Completar membresía
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line px-6 py-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mint-soft text-primary">
                <CreditCard size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-base font-bold text-navy">
                  Aún no tienes métodos de pago
                </p>
                <p className="mt-1 font-body text-sm text-muted">
                  Agrega una tarjeta de débito Visa o Mastercard para completar
                  tu membresía.
                </p>
              </div>
            </div>

            <Link
              to="/registro/pago/nuevo"
              className={getButtonClassName("primary", "w-full")}
            >
              <Plus size={16} aria-hidden="true" /> Agregar método de pago
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

interface PaymentMethodOptionProps {
  method: PaymentMethod;
  checked: boolean;
  onSelect: (id: string) => void;
}

/**
 * Una tarjeta de la lista, elegible con un radio nativo: el teclado y los
 * lectores de pantalla lo manejan sin código extra, y toda la fila es el área
 * de clic.
 */
function PaymentMethodOption({
  method,
  checked,
  onSelect,
}: PaymentMethodOptionProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20 ${
        checked ? "border-primary bg-mint-soft-2" : "border-line hover:bg-surface"
      }`}
    >
      <input
        type="radio"
        name="payment-method"
        value={method.id}
        checked={checked}
        onChange={() => onSelect(method.id)}
        className="h-4 w-4 shrink-0 accent-primary"
      />
      <CardBrandIcon brand={method.brand} />
      <span className="min-w-0 flex-1">
        <span className="block font-body text-sm font-semibold text-navy">
          <MaskedCard brand={method.brand} last4={method.last4} />
        </span>
        <span className="block truncate font-body text-xs text-muted">
          {method.holder} · Vence{" "}
          {formatExpiryLabel(method.expMonth, method.expYear)}
        </span>
      </span>
    </label>
  );
}
