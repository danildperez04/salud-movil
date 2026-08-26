import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router';
import { useEffect } from 'react';
import { useAuthStore } from './store/auth';
import { useCatalogueStore } from './store/catalogues';
import { RedirectIfAuthed, RequireAuth, RequireRole } from './auth/guards';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import StaffList from './pages/staff/StaffList';
import StaffForm from './pages/staff/StaffForm';
import PatientsList from './pages/patients/PatientsList';
import PatientForm from './pages/patients/PatientForm';
import PatientDetail from './pages/patients/PatientDetail';
import CaregiversList from './pages/caregivers/CaregiversList';
import CaregiverForm from './pages/caregivers/CaregiverForm';
import CaregiverDetail from './pages/caregivers/CaregiverDetail';

function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const loadCatalogues = useCatalogueStore((s) => s.loadAll);

  useEffect(() => {
    void bootstrap();
    void loadCatalogues().catch(() => undefined);
  }, [bootstrap, loadCatalogues]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path='/login'
            element={
              <RedirectIfAuthed>
                <Login />
              </RedirectIfAuthed>
            }
          />
        </Route>
        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path='/' element={<Home />} />
          <Route
            element={<RequireRole roles={['admin']} children={<Outlet />} />}
          >
            <Route path='/staff' element={<StaffList />} />
            <Route path='/staff/new' element={<StaffForm />} />
            <Route path='/staff/:id/edit' element={<StaffForm />} />
          </Route>
          <Route
            element={
              <RequireRole roles={['admin', 'health_staff']} children={<Outlet />} />
            }
          >
            <Route path='/caregivers' element={<CaregiversList />} />
            <Route path='/caregivers/new' element={<CaregiverForm />} />
            <Route path='/caregivers/:id' element={<CaregiverDetail />} />
            <Route path='/caregivers/:id/edit' element={<CaregiverForm />} />
          </Route>
          <Route
            element={
              <RequireRole roles={['admin', 'health_staff']} children={<Outlet />} />
            }
          >
            <Route path='/patients' element={<PatientsList />} />
            <Route path='/patients/new' element={<PatientForm />} />
            <Route path='/patients/:id' element={<PatientDetail />} />
            <Route path='/patients/:id/edit' element={<PatientForm />} />
          </Route>
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
