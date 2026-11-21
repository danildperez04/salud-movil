// features/more/domain/menu-sections.ts
import {
  Accessibility,
  Activity,
  Bell,
  Camera,
  Clock,
  FileText,
  Globe,
  HelpCircle,
  LineChart,
  Lock,
  Map,
  Mic,
  Siren,
  Stethoscope,
  type LucideIcon,
} from '@/lib/icons';
import type { es } from '@/lib/i18n/locales/es';

type MoreLabels = (typeof es)['more'];
/** Mismas claves que `items` y `sections` de los textos: el título de cada entrada se busca por id. */
export type MenuItemId = keyof MoreLabels['items'];
export type MenuSectionId = keyof MoreLabels['sections'];

export type MenuItem = {
  id: MenuItemId;
  icon: LucideIcon;
  /** sin `href` la entrada todavía no tiene pantalla: se muestra como "Pronto" */
  href?: string;
  /** danger resalta la entrada en rojo (emergencias) */
  tone?: 'default' | 'danger';
};

export type MenuSection = {
  id: MenuSectionId;
  items: MenuItem[];
};

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: 'health',
    items: [
      { id: 'reminders', icon: Bell, href: '/(app)/reminders' },
      {
        id: 'medicalRecord',
        icon: FileText,
        href: '/(app)/medical-record',
      },
      { id: 'indicators', icon: LineChart, href: '/(app)/health-indicators' },
      { id: 'activity', icon: Activity, href: '/(app)/activity' },
    ],
  },
  {
    id: 'services',
    items: [
      { id: 'scanner', icon: Camera },
      { id: 'voice', icon: Mic, href: '/(app)/voice-assistant' },
      { id: 'referral', icon: Stethoscope, href: '/(app)/referral' },
      { id: 'waitTimes', icon: Clock, href: '/(app)/wait-times' },
      { id: 'healthMap', icon: Map, href: '/(app)/health-map' },
    ],
  },
  {
    id: 'accessibility',
    items: [
      {
        id: 'accessibilityCenter',
        icon: Accessibility,
        href: '/(app)/accessibility',
      },
      { id: 'language', icon: Globe, href: '/(app)/language' },
    ],
  },
  {
    id: 'preferences',
    items: [
      {
        id: 'notifications',
        icon: Bell,
        href: '/(app)/notifications/settings',
      },
      { id: 'privacy', icon: Lock, href: '/(app)/security' },
    ],
  },
  {
    id: 'help',
    items: [
      {
        id: 'emergency',
        icon: Siren,
        href: '/(app)/emergency',
        tone: 'danger',
      },
      { id: 'support', icon: HelpCircle, href: '/(app)/help' },
    ],
  },
];
