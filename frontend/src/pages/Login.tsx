import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/auth';
import { ApiError } from '../lib/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y tu contraseña');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo iniciar sesión, inténtalo de nuevo',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl'>
      <h1 className='text-2xl font-bold text-slate-900'>Inicia sesión</h1>
      <p className='mb-6 mt-1 text-sm text-slate-500'>
        Accede al panel de Salud Móvil
      </p>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <Input
          label='Correo electrónico o usuario'
          type='text'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder='tucorreo@example.com'
          autoComplete='username'
        />
        <Input
          label='Contraseña'
          type='password'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder='••••••••'
          autoComplete='current-password'
        />
        {error ? <Alert>{error}</Alert> : null}
        <Button type='submit' loading={loading}>
          Iniciar sesión
        </Button>
      </form>
    </div>
  );
}
