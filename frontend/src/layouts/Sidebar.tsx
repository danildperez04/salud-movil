import { NavLink } from "react-router";
import { Logo } from "../components/ui/Logo";
import { NAV_SECTIONS } from "../lib/navigation";
import { useAuthStore } from "../store/auth";

export function Sidebar() {
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-white">
      <div className="px-6 py-5">
        <Logo />
        <p className="mt-1 font-body text-xs text-muted">Panel de gestión</p>
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 pb-6">
        {NAV_SECTIONS.map((section) => {
          const items = section.items.filter(
            (item) => user && item.roles.includes(user.role),
          );
          if (items.length === 0) return null;

          return (
            <div key={section.title}>
              <p className="px-3 pb-2 font-body text-[11px] font-semibold uppercase tracking-wide text-muted">
                {section.title}
              </p>
              <div className="flex flex-col gap-1">
                {items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-full px-3 py-2 font-body text-sm font-medium transition ${
                        isActive
                          ? "bg-mint-soft text-primary-dark"
                          : "text-navy hover:bg-surface"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            isActive
                              ? "bg-white text-primary"
                              : "bg-mint-soft text-primary"
                          }`}
                        >
                          <item.icon size={16} aria-hidden="true" />
                        </span>
                        {item.label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
