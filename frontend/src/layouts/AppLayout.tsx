import { Bell, LogOut } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../store/auth";
import { ROLE_LABELS } from "../lib/roles";
import { getInitials } from "../lib/initials";
import { Sidebar } from "./Sidebar";

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const roleLabel = user ? (ROLE_LABELS[user.role] ?? user.role) : "";

  /** Sin navegar, el guard reacciona en el siguiente render y queda un frame
   * con el panel todavía visible tras cerrar sesión. */
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen w-full bg-surface">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-white px-6 py-3">
          <Link
            to="/app/perfil"
            className="flex items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-surface"
            aria-label="Mi perfil"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint-soft font-display text-sm font-semibold text-primary-dark">
              {getInitials(user?.name)}
            </span>
            <div className="leading-tight">
              <p className="font-body text-sm font-semibold text-navy">
                {user?.name}
              </p>
              <p className="font-body text-xs text-muted">
                {roleLabel} · Salud Móvil
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/app/notifications"
              aria-label="Notificaciones"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-primary"
            >
              <Bell size={18} aria-hidden="true" />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-body text-sm font-medium text-muted transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={16} aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
