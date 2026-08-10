import { BrowserRouter, Route, Routes } from 'react-router';
import AuthLayout from './layouts/AuthLayout.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
