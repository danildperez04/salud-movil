import { NavLink, Outlet } from 'react-router';
import { useAuthStore } from '../store/auth';
import { Badge } from '../components/ui/Badge';
import { ROLE_LABELS } from '../lib/roles';

const NAV_ITEMS: { to: string; label: string; roles: string[] }[] = [
  { to: '/', label: 'Inicio', roles: ['admin', 'health_staff'] },
  { to: '/staff', label: 'Personal de salud', roles: ['admin'] },
  { to: '/patients', label: 'Pacientes', roles: ['admin', 'health_staff'] },
];

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const items = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role));

  return (
    <div className='flex min-h-screen w-full bg-slate-50'>
      <aside className='flex w-64 flex-col border-r border-slate-200 bg-white'>
        <div className='px-6 py-5'>
          <h1 className='text-xl font-bold text-primary'>Salud Móvil</h1>
          <p className='text-xs text-slate-500'>Panel de gestión</p>
        </div>
        <nav className='flex flex-1 flex-col gap-1 px-3'>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className='flex min-w-0 flex-1 flex-col'>
        <header className='flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3'>
          <div className='flex items-center gap-3'>
            <span className='text-sm font-semibold text-slate-900'>
              {user?.name}
            </span>
            {user ? (
              <Badge variant='primary'>
                {ROLE_LABELS[user.role] ?? user.role}
              </Badge>
            ) : null}
          </div>
          <button
            onClick={logout}
            className='rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100'
          >
            Cerrar sesión
          </button>
        </header>
        <main className='flex-1 overflow-y-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
