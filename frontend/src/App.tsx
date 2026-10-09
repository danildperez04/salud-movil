import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth";
import { useCatalogueStore } from "./store/catalogues";
import { RedirectIfAuthed, RequireAuth, RequireRole } from "./auth/guards";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./landing/LandingPage";
import Login from "./pages/Login";
import RecoverPassword from "./pages/RecoverPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import TwoFactorVerify from "./pages/TwoFactorVerify";
import Home from "./pages/Home";
import ComingSoon from "./pages/ComingSoon";
import StaffList from "./pages/staff/StaffList";
import StaffForm from "./pages/staff/StaffForm";
import PatientsList from "./pages/patients/PatientsList";
import PatientForm from "./pages/patients/PatientForm";
import PatientDetail from "./pages/patients/PatientDetail";
import CaregiversList from "./pages/caregivers/CaregiversList";
import CaregiverForm from "./pages/caregivers/CaregiverForm";
import CaregiverDetail from "./pages/caregivers/CaregiverDetail";
import Releases from "./pages/admin/Releases";
import DemoRequests from "./pages/admin/DemoRequests";
import PatientRecord from "./pages/patients/PatientRecord";
import { Toaster } from "sonner";

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
        <Route path="/" element={<LandingPage />} />
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <RedirectIfAuthed>
                <Login />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/recuperar"
            element={
              <RedirectIfAuthed>
                <RecoverPassword />
              </RedirectIfAuthed>
            }
          />
          {/* 2FA verification - pública como /login pero sin RedirectIfAuthed
              porque el usuario puede llegar aquí tras login con 2FA pendiente */}
          <Route path="/2fa/verify" element={<TwoFactorVerify />} />
          {/* Último paso de la recuperación: con el token del enlace. Va fuera
              de `RedirectIfAuthed` a propósito: quien restablece su contraseña
              puede haber perdido la sesión y aun así necesita entrar. */}
          <Route path="/nueva-contrasena" element={<ResetPassword />} />
        </Route>
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Home />} />
          <Route
            element={<RequireRole roles={["admin"]} children={<Outlet />} />}
          >
            <Route path="staff" element={<StaffList />} />
            <Route path="staff/new" element={<StaffForm />} />
            <Route path="staff/:id/edit" element={<StaffForm />} />
            {/* TODO: reemplazar por la página real de Reportes */}
            <Route path="perfil" element={<Profile />} />
            <Route path="reports" element={<ComingSoon title="Reportes" />} />
            <Route path="demo-requests" element={<DemoRequests />} />
            <Route path="releases" element={<Releases />} />
          </Route>
          <Route
            element={
              <RequireRole
                roles={["admin", "health_staff"]}
                children={<Outlet />}
              />
            }
          >
            <Route path="caregivers" element={<CaregiversList />} />
            <Route path="caregivers/new" element={<CaregiverForm />} />
            <Route path="caregivers/:id" element={<CaregiverDetail />} />
            <Route path="caregivers/:id/edit" element={<CaregiverForm />} />
          </Route>
          <Route
            element={
              <RequireRole
                roles={["admin", "health_staff"]}
                children={<Outlet />}
              />
            }
          >
            <Route path="patients" element={<PatientsList />} />
            <Route path="patients/new" element={<PatientForm />} />
            <Route path="patients/:id" element={<PatientDetail />} />
            <Route path="patients/:id/edit" element={<PatientForm />} />
            <Route path="patients/:id/record" element={<PatientRecord />} />
          </Route>
          <Route
            element={
              <RequireRole
                roles={["admin", "health_staff"]}
                children={<Outlet />}
              />
            }
          >
            {/* TODO: reemplazar cada ComingSoon por la página real cuando exista */}
            <Route
              path="priority"
              element={<ComingSoon title="Prioridad IPCP" />}
            />
            <Route
              path="priority-map"
              element={<ComingSoon title="Mapa de prioridad" />}
            />
            <Route path="alerts" element={<ComingSoon title="Alertas" />} />
            <Route
              path="notifications"
              element={<ComingSoon title="Notificaciones" />}
            />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast: 'font-body',
            description: 'font-body text-sm',
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
