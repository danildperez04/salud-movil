import { useState } from "react";
import type { FormEvent } from "react";
import { KeyRound, LogOut, ShieldCheck, Shield, ShieldOff } from "lucide-react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/Card";
import { Alert } from "../components/ui/Alert";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ConfirmDeleteModal } from "../components/ui/ConfirmDeleteModal";
import { api, ApiError } from "../lib/api";
import { ROLE_LABELS } from "../lib/roles";
import { useAuthStore } from "../store/auth";
import { getInitials } from "../lib/initials";
import { toast } from "sonner";

/** Mínimo que exige la API (`@MinLength(8)`). */
const MIN_LENGTH = 8;

/**
 * Perfil y cierre de sesión (HU-08).
 *
 * `GET /auth/me` ya existía y el store de autenticación ya guardaba el usuario,
 * así que faltaba la pantalla. El cambio de contraseña también tenía endpoint
 * (`POST /auth/change-password`) sin interfaz.
 */
export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 2FA state
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [disableLoading, setDisableLoading] = useState(false);
  const [enableLoading, setEnableLoading] = useState(false);

  if (!user) {
    return null;
  }

  const worker = user.healthcareWorker;

  async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    if (!currentPassword) {
      setError("Ingresa tu contraseña actual.");
      return;
    }
    if (newPassword.length < MIN_LENGTH) {
      setError(`La nueva contraseña debe tener al menos ${MIN_LENGTH} caracteres.`);
      return;
    }
    if (newPassword === currentPassword) {
      setError("La nueva contraseña debe ser distinta de la actual.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSaving(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo cambiar la contraseña",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleEnableTwoFactor() {
    setEnableLoading(true);
    try {
      const response = await api.enableTwoFactor();
      navigate(`/2fa/verify?challengeId=${response.challengeId}&mode=enable`, { replace: true });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo activar 2FA');
    } finally {
      setEnableLoading(false);
    }
  }

  function openDisableModal() {
    setDisablePassword("");
    setShowDisableModal(true);
  }

  async function handleDisableConfirm() {
    if (!disablePassword.trim()) return;

    setDisableLoading(true);
    try {
      await api.disableTwoFactor(disablePassword);
      setShowDisableModal(false);
      setDisablePassword("");
      // Update local user state via store
      useAuthStore.setState((state) => ({
        user: state.user ? { ...state.user, twoFactorEnabled: false } : null,
      }));
      toast.success('2FA desactivado correctamente');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo desactivar 2FA');
    } finally {
      setDisableLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const fields: { label: string; value: string }[] = [
    { label: "Usuario", value: user.username },
    { label: "Correo", value: user.email },
    { label: "Teléfono", value: user.phoneNumber },
    { label: "Dirección", value: user.address },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Mi perfil</h1>
          <p className="mt-1 font-body text-sm text-muted">
            Tus datos y la seguridad de tu cuenta.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-6">
            <Card title="Datos de la cuenta">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mint-soft font-display text-base font-bold text-primary-dark">
                  {getInitials(user.name)}
                </span>
                <div>
                  <p className="font-display text-base font-bold text-navy">
                    {user.name}
                  </p>
                  <Badge variant="primary">{ROLE_LABELS[user.role] ?? user.role}</Badge>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.label}>
                    <p className="font-body text-xs uppercase tracking-wide text-muted">
                      {field.label}
                    </p>
                    <p className="mt-0.5 font-body text-sm font-semibold text-navy">
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>

              {worker ? (
                <div className="mt-5 border-t border-line pt-4">
                  <p className="font-body text-xs uppercase tracking-wide text-muted">
                    Datos profesionales
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    {[
                      { label: "Licencia", value: worker.licenseNumber },
                      { label: "Registro", value: worker.employeeId },
                      { label: "Profesión", value: worker.majorName ?? "—" },
                      { label: "Centro de salud", value: worker.healthCenterName ?? "—" },
                    ].map((field) => (
                      <div key={field.label}>
                        <p className="font-body text-xs text-muted">
                          {field.label}
                        </p>
                        <p className="mt-0.5 font-body text-sm font-semibold text-navy">
                          {field.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </Card>

            <Card title="Cambiar contraseña">
              <form
                onSubmit={handleChangePassword}
                className="flex flex-col gap-4"
                noValidate
              >
                <Input
                  label="Contraseña actual"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
                />
                <Input
                  label="Nueva contraseña"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                />
                <Input
                  label="Repetir nueva contraseña"
                  type="password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  autoComplete="new-password"
                  error={
                    confirm && newPassword !== confirm
                      ? "Las contraseñas no coinciden"
                      : undefined
                  }
                />
                {error ? <Alert>{error}</Alert> : null}
                {saved ? (
                  <Alert variant="success">
                    Contraseña actualizada. Las sesiones abiertas siguen activas.
                  </Alert>
                ) : null}
                <Button type="submit" loading={saving}>
                  <KeyRound size={16} aria-hidden="true" /> Actualizar contraseña
                </Button>
              </form>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card title="Verificación en dos pasos (2FA)">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.twoFactorEnabled ? (
                    <Shield className="h-6 w-6 text-green-600" aria-hidden="true" />
                  ) : (
                    <ShieldOff className="h-6 w-6 text-muted" aria-hidden="true" />
                  )}
                  <div>
                    <p className="font-body text-sm font-medium text-navy">
                      {user.twoFactorEnabled ? '2FA activado' : '2FA desactivado'}
                    </p>
                    <p className="font-body text-xs text-muted">
                      {user.twoFactorEnabled
                        ? 'Se requiere un código OTP al iniciar sesión'
                        : 'Añade una capa extra de seguridad a tu cuenta'}
                    </p>
                  </div>
                </div>
                {user.twoFactorEnabled ? (
                  <Button
                    variant="secondary"
                    onClick={openDisableModal}
                    disabled={disableLoading}
                  >
                    <ShieldOff size={16} aria-hidden="true" className="mr-2" />
                    Desactivar 2FA
                  </Button>
                ) : (
                  <Button onClick={handleEnableTwoFactor} loading={enableLoading}>
                    <Shield size={16} aria-hidden="true" className="mr-2" />
                    Activar 2FA
                  </Button>
                )}
              </div>
            </Card>

            <Card title="Sesión">
              <p className="flex items-start gap-2 font-body text-sm text-muted">
                <ShieldCheck size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
                <span>
                  Tu sesión se cierra automáticamente si el token caduca. Al
                  cerrarla se borra también el estado guardado en el navegador.
                </span>
              </p>
              <Button
                variant="secondary"
                className="mt-4 w-full"
                onClick={handleLogout}
              >
                <LogOut size={16} aria-hidden="true" /> Cerrar sesión
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDisableModal}
        onCancel={() => setShowDisableModal(false)}
        onConfirm={handleDisableConfirm}
        loading={disableLoading}
        title="Desactivar verificación en dos pasos"
        confirmLabel="Desactivar"
        message={
          <div className="space-y-3">
            <p className="text-sm text-slate-700">
              Para desactivar la verificación en dos pasos, ingresa tu contraseña actual.
            </p>
            <Input
              label="Contraseña actual"
              type="password"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              autoComplete="current-password"
              autoFocus
              error={disablePassword && !disablePassword.trim() ? 'Ingresa tu contraseña' : undefined}
            />
          </div>
        }
      />
    </>
  );
}