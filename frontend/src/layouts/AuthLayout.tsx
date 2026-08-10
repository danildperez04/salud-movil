import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <div className='w-full h-full flex'>
      <main className='flex-1 flex justify-center items-center'>
        <Outlet />
      </main>
    </div>
  );
}
