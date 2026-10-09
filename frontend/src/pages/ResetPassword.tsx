import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { Logo } from "../components/ui/Logo";
import { api, ApiError } from "../lib/api";

/** Mínimo que exige la API (`@MinLength(8)`). */
const MIN_LENGTH = 8;

/**
 * Último paso de la recuperación de contraseña (HU-04): establecer la nueva
 * contraseña con el token del enlace.
 *
 * `RecoverPassword` iniciaba el proceso, pero no había dónde completarlo, así
 * que el flujo terminaba en el envío del correo. Este es el paso que faltaba.
 *
 * ⚠️ **El envío de correo todavía no existe.** La API registra el token solo
 * fuera de producción (`auth.service.ts`), así que en desarrollo hay que
 * tomarlo del log. El flujo de producción queda pendiente del servicio de
 * correo: está documentado como fuera del MVP en el plan de cierre.
 */
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError(
        "El enlace no incluye el token de restablecimiento. Solicita uno nuevo desde la pantalla de recuperación.",
      );
      return;
    }
    if (password.length < MIN_LENGTH) {
      setError(`La contraseña debe tener al menos ${MIN_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setDone(true);
      // No forzamos el login: el usuario entra con la contraseña que acaba de
      // elegir, desde la pantalla de inicio de sesión.
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo restablecer la contraseña",
      );
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-soft">
        <div className="flex flex-col items-center gap-3 pt-2 text-center">
          <CheckCircle2 size={40} className="text-primary" aria-hidden="true" />
          <h1 className="font-display text-xl font-bold text-navy">
            Contraseña actualizada
          </h1>
          <p className="font-body text-sm text-primary-dark">
            Ya puedes iniciar sesión con tu nueva contraseña. Te llevamos al
            inicio de sesión…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-soft">
      <Link
        to="/login"
        className="inline-flex items-center gap-1 font-body text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Volver
      </Link>

      <div className="mt-4">
        <Logo />
      </div>

      <h1 className="mt-6 font-display text-xl font-bold text-navy">
        Nueva contraseña
      </h1>
      <p className="mb-6 mt-1 font-body text-sm text-primary-dark">
        Elige una contraseña de al menos {MIN_LENGTH} caracteres.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Nueva contraseña"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          autoFocus
        />
        <Input
          label="Repetir contraseña"
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          autoComplete="new-password"
          error={
            confirm && password !== confirm
              ? "Las contraseñas no coinciden"
              : undefined
          }
        />
        {error ? <Alert>{error}</Alert> : null}
        <Button type="submit" loading={loading} className="w-full">
          Guardar contraseña
        </Button>
      </form>
    </div>
  );
}