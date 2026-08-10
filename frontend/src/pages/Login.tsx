import { Link } from 'react-router';

export default function Login() {
  return (
    <div className='w-md rounded-2xl shadow-2xl p-10'>
      <h1 className='text-2xl text-primary mb-6'>Inicia sesion aca</h1>
      <form className='flex flex-col gap-4' action=''>
        <div className='flex flex-col'>
          <label className='text-small' htmlFor='email'>
            Correo electronico
          </label>
          <input type='text' name='email' id='email' />
        </div>
        <div className='flex flex-col'>
          <label className='text-small' htmlFor='password'>
            Contraseña
          </label>
          <input type='password' name='password' id='password' />
        </div>
        <p>
          No tienes cuenta? <Link to='/signup'>Registrate aca</Link>
        </p>
        <button type='submit'>Inicia Sesion</button>
      </form>
    </div>
  );
}
