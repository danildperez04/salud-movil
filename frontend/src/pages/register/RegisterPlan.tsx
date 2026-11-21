import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Logo } from "../../components/ui/Logo";
import { PlanCard } from "../../components/register/PlanCard";
import { PLANS } from "../../lib/plans";
import type { PlanId } from "../../lib/plans";
import { useRegisterStore } from "../../store/register";

// Misma regla que el formulario de solicitud de demo de la landing.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMAIL_FIELD_ID = "register-email";

/**
 * Paso 1 del registro de membresía: el correo y la elección del plan.
 *
 * Elegir un plan es el botón de su tarjeta, y por eso el correo se valida en
 * ese momento. El campo está arriba de las tarjetas; en el celular, cuando el
 * botón de la segunda tarjeta queda a una pantalla de distancia, un error
 * pintado solo junto al campo no se vería, así que además se le da el foco, lo
 * que lo trae a la vista.
 */
export default function RegisterPlan() {
  const navigate = useNavigate();
  const draft = useRegisterStore((s) => s.draft);
  const start = useRegisterStore((s) => s.start);

  // Si se vuelve desde el paso de pago ("Volver"), el correo sigue puesto.
  const [email, setEmail] = useState(draft?.email ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSelectPlan(planId: PlanId) {
    const value = email.trim();
    if (!EMAIL.test(value)) {
      setError(
        value
          ? "Ingresa un correo válido."
          : "Ingresa tu correo electrónico para continuar.",
      );
      document.getElementById(EMAIL_FIELD_ID)?.focus();
      return;
    }
    start(value, planId);
    navigate("/registro/pago");
  }

  return (
    <div className="w-full max-w-4xl rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8">
      <Link
        to="/login"
        className="inline-flex items-center gap-1 font-body text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Volver
      </Link>

      <div className="mt-4">
        <Logo />
      </div>

      <p className="mt-6 font-body text-xs font-semibold uppercase tracking-wide text-primary-dark">
        Paso 1 de 2
      </p>
      <h1 className="mt-1 font-display text-2xl font-bold text-navy">
        Crea tu cuenta
      </h1>
      <p className="mb-6 mt-1 font-body text-sm text-muted">
        Ingresa tu correo y elige el plan que necesitas. Después agregarás tu
        método de pago.
      </p>

      <div className="max-w-md">
        <Input
          id={EMAIL_FIELD_ID}
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(null);
          }}
          placeholder="correo@ejemplo.com"
          autoComplete="email"
          error={error ?? undefined}
          autoFocus
        />
        <p className="mt-1.5 font-body text-xs text-muted">
          Aquí recibirás la contraseña para ingresar al sistema.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {Object.values(PLANS).map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={handleSelectPlan} />
        ))}
      </div>
    </div>
  );
}
