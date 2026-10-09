import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Loader2, RefreshCw, ArrowLeft, RotateCcw } from 'lucide-react';
import { OTPInput } from '../components/ui/OTPInput';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Logo } from '../components/ui/Logo';
import { api, ApiError } from '../lib/api';
import { useAuthStore } from '../store/auth';
import { toast } from 'sonner';

export default function TwoFactorVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    pendingTwoFactorChallenge,
    twoFactorMode,
    completeTwoFactorLogin,
    clearPendingTwoFactor,
    updatePendingTwoFactorChallenge,
  } = useAuthStore();

  const challengeId = searchParams.get('challengeId');
  const mode = (searchParams.get('mode') as 'login' | 'enable' | null) ?? 'login';

  const [code, setCode] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const expiresAt = pendingTwoFactorChallenge?.expiresAt
    ? new Date(pendingTwoFactorChallenge.expiresAt).getTime()
    : null;

  // Estos dos se derivan en cada render: guardarlos en estado y sincronizarlos
  // desde un effect provocaba un render extra por cada cambio.
  const sessionError =
    !challengeId || !pendingTwoFactorChallenge
      ? 'Sesión de verificación inválida. Vuelve a iniciar sesión.'
      : mode !== twoFactorMode
        ? 'Modo de verificación no coincide. Vuelve a intentarlo.'
        : null;
  const error = actionError ?? sessionError;

  const timeRemaining = expiresAt ? Math.max(0, expiresAt - now) : 0;
  const expired = expiresAt !== null && timeRemaining === 0;

  // El reloj solo corre mientras el código siga vigente.
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      setNow(Date.now());
      if (Date.now() >= expiresAt) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((c) => Math.max(0, c - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const isFormValid = code.length === 6 && !loading && !expired;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isFormValid || !challengeId) return;

    setLoading(true);
    setActionError(null);

    try {
      await completeTwoFactorLogin(code, navigate, mode);
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : 'Código inválido o expirado. Inténtalo de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!challengeId || resendCooldown > 0) return;

    setResendLoading(true);
    try {
      const response = await api.resendTwoFactor(challengeId);
      updatePendingTwoFactorChallenge(response);
      setResendCooldown(30);
      toast.success('Código reenviado. Revisa la consola del backend.');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo reenviar el código');
    } finally {
      setResendLoading(false);
    }
  }

  function handleBack() {
    clearPendingTwoFactor();
    navigate('/login', { replace: true });
  }

  return (
    <div className="grid w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-white shadow-soft md:grid-cols-2">
      <div className="flex flex-col justify-between bg-linear-to-br from-mint-soft to-white p-8">
        <div>
          <Logo />
          <p className="mt-1 font-body text-sm text-muted">Tu salud, en tus manos</p>
        </div>
        <div className="mt-10">
          <h2 className="font-display text-2xl font-bold text-navy">Verificación en dos pasos</h2>
          <p className="mt-2 font-body text-sm text-muted">
            Ingresa el código de 6 dígitos que se ha generado.
          </p>
        </div>
      </div>

      <div className="p-8">
        <h1 className="font-display text-2xl font-bold text-navy">Código de verificación</h1>
        <p className="mb-6 mt-1 font-body text-sm text-muted">
          El código se muestra en la consola del servidor backend.
        </p>

        {error && <div className="mb-4"><Alert>{error}</Alert></div>}

        {!expired ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <OTPInput
              value={code}
              onChange={setCode}
              onComplete={() => isFormValid && handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>)}
              disabled={loading || expired}
              autoFocus
              error={error ?? undefined}
            />

            <div className="flex items-center justify-between text-sm text-muted">
              <span>
                Expira en <span className="font-mono font-bold text-navy ml-1">{formatTime(timeRemaining)}</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                className="text-sm whitespace-nowrap"
                onClick={handleResend}
                disabled={resendLoading || resendCooldown > 0 || expired}
              >
                {resendLoading ? (
                  <Loader2 size={14} className="animate-spin mr-1" />
                ) : resendCooldown > 0 ? (
                  <>
                    <RefreshCw size={14} className="mr-1" /> {resendCooldown}s
                  </>
                ) : (
                  'Reenviar código'
                )}
              </Button>
            </div>

            {error && !expired && (
              <p className="font-body text-xs text-muted text-center">
                ¿No recibiste el código? Revisa la consola del backend donde se ejecuta la API.
              </p>
            )}

            <Button type="submit" loading={loading} disabled={!isFormValid} className="mt-2 w-full">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Verificando...
                </>
              ) : (
                'Verificar código'
              )}
            </Button>
          </form>
        ) : (
          <div className="mt-4 space-y-3">
            <Alert variant="error">El código ha expirado.</Alert>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="ghost"
                onClick={handleResend}
                disabled={resendLoading || resendCooldown > 0}
                className="w-full sm:w-auto"
              >
                {resendLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-1" />
                    Reenviando...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <RefreshCw size={14} className="mr-1" /> {resendCooldown}s
                  </>
                ) : (
                  <>
                    <RotateCcw size={14} className="mr-1" />
                    Reenviar código
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={handleBack}
                className="w-full sm:w-auto"
              >
                <ArrowLeft size={16} aria-hidden="true" className="mr-2" />
                Volver al inicio de sesión
              </Button>
            </div>
          </div>
        )}

        {!expired && (
          <Button
            variant="secondary"
            className="mt-4 w-full"
            onClick={handleBack}
            disabled={loading}
          >
            <ArrowLeft size={16} aria-hidden="true" className="mr-2" />
            Volver al inicio de sesión
          </Button>
        )}
      </div>
    </div>
  );
}