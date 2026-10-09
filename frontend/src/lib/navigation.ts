import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarCheck,
  PackageOpen,
  Home,
  HeartHandshake,
  Map,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Roles que pueden ver este item. Debe coincidir con los guards de App.tsx. */
  roles: string[];
  /** Igual que la prop `end` de NavLink: evita que rutas padre queden "activas" de más. */
  end?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// NOTA: los roles de los items nuevos (priority, priority-map, alerts,
// notifications, reports) son un supuesto razonable, no una decisión de
// negocio confirmada. Ajusta según quién debe ver cada sección.
export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Gestión",
    items: [
      {
        to: "/app",
        label: "Inicio",
        icon: Home,
        roles: ["admin", "health_staff"],
        end: true,
      },
      {
        to: "/app/priority",
        label: "Prioridad IPCP",
        icon: Activity,
        roles: ["admin", "health_staff"],
      },
      {
        to: "/app/priority-map",
        label: "Mapa de prioridad",
        icon: Map,
        roles: ["admin", "health_staff"],
      },
      {
        to: "/app/patients",
        label: "Pacientes",
        icon: Users,
        roles: ["admin", "health_staff"],
      },
      {
        to: "/app/caregivers",
        label: "Cuidadores",
        icon: HeartHandshake,
        roles: ["admin", "health_staff"],
      },
      {
        to: "/app/staff",
        label: "Personal de salud",
        icon: UserCog,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Seguimiento",
    items: [
      {
        to: "/app/alerts",
        label: "Alertas",
        icon: AlertTriangle,
        roles: ["admin", "health_staff"],
      },
      {
        to: "/app/notifications",
        label: "Notificaciones",
        icon: Bell,
        roles: ["admin", "health_staff"],
      },
      {
        to: "/app/reports",
        label: "Reportes",
        icon: BarChart3,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Sitio web",
    items: [
      {
        to: "/app/demo-requests",
        label: "Solicitudes de demo",
        icon: CalendarCheck,
        roles: ["admin"],
      },
      {
        to: "/app/releases",
        label: "Instaladores",
        icon: PackageOpen,
        roles: ["admin"],
      },
    ],
  },
];
