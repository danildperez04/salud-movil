import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/auth";
import { ApiError } from "../lib/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { Logo } from "../components/ui/Logo";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Ingresa tu correo y tu contraseña");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo iniciar sesión, inténtalo de nuevo",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-white shadow-soft md:grid-cols-2">
      {/* Panel izquierdo: identidad de marca */}
      <div className="flex flex-col justify-between bg-linear-to-br from-mint-soft to-white p-8">
        <div>
          <Logo />
          <p className="mt-1 font-body text-sm text-muted">
            Tu salud, en tus manos
          </p>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-2xl font-bold text-navy">
            Panel Administrativo
          </h2>
          <p className="mt-2 font-body text-sm text-muted">
            Gestiona pacientes, cuidadores y personal de salud, priorizando la
            atención mediante el IPCP.
          </p>
        </div>
      </div>

      {/* Panel derecho: formulario */}
      <div className="p-8">
        <h1 className="font-display text-2xl font-bold text-navy">
          Inicio de Sesión
        </h1>
        <p className="mb-6 mt-1 font-body text-sm text-muted">
          Ingresa tus datos para acceder al panel administrativo
        </p>
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
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            labelSlot={
              <a
                href="/recuperar"
                className="font-body text-xs font-medium text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            }
          />
          {error ? <Alert>{error}</Alert> : null}
          <Button type="submit" loading={loading} className="mt-2 w-full">
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
