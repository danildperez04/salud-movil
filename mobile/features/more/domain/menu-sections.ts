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
} from 'lucide-react-native';
import { MORE_LABELS } from '@/constants/labels';

export type MenuItem = {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  /** sin `href` la entrada todavía no tiene pantalla: se muestra como "Pronto" */
  href?: string;
  /** danger resalta la entrada en rojo (emergencias) */
  tone?: 'default' | 'danger';
};

export type MenuSection = {
  id: string;
  title: string;
  items: MenuItem[];
};

const { items, sections } = MORE_LABELS;

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: 'health',
    title: sections.health,
    items: [
      { id: 'reminders', icon: Bell, ...items.reminders, href: '/(app)/reminders' },
      {
        id: 'medical-record',
        icon: FileText,
        ...items.medicalRecord,
        href: '/(app)/medical-record',
      },
      { id: 'indicators', icon: LineChart, ...items.indicators, href: '/(app)/health-indicators' },
      { id: 'activity', icon: Activity, ...items.activity, href: '/(app)/activity' },
    ],
  },
  {
    id: 'services',
    title: sections.services,
    items: [
      { id: 'scanner', icon: Camera, ...items.scanner },
      { id: 'voice', icon: Mic, ...items.voice, href: '/(app)/voice-assistant' },
      { id: 'referral', icon: Stethoscope, ...items.referral, href: '/(app)/referral' },
      { id: 'wait-times', icon: Clock, ...items.waitTimes, href: '/(app)/wait-times' },
      { id: 'health-map', icon: Map, ...items.healthMap, href: '/(app)/health-map' },
    ],
  },
  {
    id: 'accessibility',
    title: sections.accessibility,
    items: [
      {
        id: 'accessibility-center',
        icon: Accessibility,
        ...items.accessibilityCenter,
        href: '/(app)/accessibility',
      },
      { id: 'language', icon: Globe, ...items.language, href: '/(app)/language' },
    ],
  },
  {
    id: 'preferences',
    title: sections.preferences,
    items: [
      {
        id: 'notifications',
        icon: Bell,
        ...items.notifications,
        href: '/(app)/notifications/settings',
      },
      { id: 'privacy', icon: Lock, ...items.privacy, href: '/(app)/security' },
    ],
  },
  {
    id: 'help',
    title: sections.help,
    items: [
      {
        id: 'emergency',
        icon: Siren,
        ...items.emergency,
        href: '/(app)/emergency',
        tone: 'danger',
      },
      { id: 'support', icon: HelpCircle, ...items.support, href: '/(app)/help' },
    ],
  },
];
