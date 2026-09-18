import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { Logo } from "../components/ui/Logo";
import { ApiError } from "../lib/api";

export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Ingresa tu correo electrónico");
      return;
    }
    setLoading(true);
    try {
      // TODO: agregar `requestPasswordReset` a lib/api.ts cuando exista
      // el endpoint en el backend, ej.:
      //   requestPasswordReset(email: string) {
      //     return request<void>('/auth/forgot-password', {
      //       method: 'POST',
      //       body: JSON.stringify({ email }),
      //     });
      //   },
      // await api.requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo enviar el correo, inténtalo de nuevo",
      );
    } finally {
      setLoading(false);
    }
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
        Recuperar contraseña
      </h1>
      <p className="mb-6 mt-1 font-body text-sm text-primary-dark">
        Te enviaremos instrucciones a tu correo administrativo.
      </p>

      {submitted ? (
        <Alert variant="success">
          Si el correo existe en nuestro sistema, recibirás instrucciones para
          restablecer tu contraseña en unos minutos.
        </Alert>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@saludmovil.com"
            autoComplete="username"
            autoFocus
          />
          {error ? <Alert>{error}</Alert> : null}
          <Button type="submit" loading={loading} className="w-full">
            Enviar instrucciones
          </Button>
        </form>
      )}
    </div>
  );
}
