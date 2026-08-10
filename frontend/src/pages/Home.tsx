import { Link } from 'react-router';
import { useAuthStore } from '../store/auth';
import { ROLE_LABELS } from '../lib/roles';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';

  return (
    <div className='mx-auto flex max-w-3xl flex-col gap-6'>
      <Card>
        <h1 className='text-xl font-semibold text-slate-900'>
          ¡Hola, {user?.name}!
        </h1>
        <p className='mt-1 text-sm text-slate-600'>
          Bienvenido al panel de{' '}
          <Badge variant='primary'>{ROLE_LABELS[user?.role ?? '']}</Badge>
          {user?.healthcareWorker?.healthCenterName ? (
            <span className='ml-2 text-slate-500'>
              · {user.healthcareWorker.healthCenterName}
            </span>
          ) : null}
        </p>
      </Card>
      <div className='grid gap-4 sm:grid-cols-2'>
        {isAdmin ? (
          <Link to='/staff'>
            <Card className='transition hover:border-primary hover:shadow-md'>
              <h2 className='font-semibold text-slate-900'>Personal de salud</h2>
              <p className='mt-1 text-sm text-slate-600'>
                Crear y administrar el personal de salud del sistema.
              </p>
            </Card>
          </Link>
        ) : null}
        <Link to='/patients'>
          <Card className='transition hover:border-primary hover:shadow-md'>
            <h2 className='font-semibold text-slate-900'>Pacientes</h2>
            <p className='mt-1 text-sm text-slate-600'>
              Consultar y administrar los pacientes y sus expedientes.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
