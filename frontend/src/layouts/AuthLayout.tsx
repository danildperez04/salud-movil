import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <div className='flex min-h-screen w-full bg-slate-50'>
      <aside className='hidden w-2/5 flex-col justify-between bg-primary p-10 text-white lg:flex'>
        <div>
          <h1 className='text-3xl font-bold'>Salud Móvil</h1>
          <p className='mt-2 text-primary-light'>
            Cuidado de salud a tu alcance
          </p>
        </div>
        <p className='text-sm text-white/70'>
          Plataforma para pacientes, cuidadores y personal de salud.
        </p>
      </aside>
      <main className='flex flex-1 items-center justify-center p-6'>
        <Outlet />
      </main>
    </div>
  );
}
