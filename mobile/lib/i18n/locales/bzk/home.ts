// lib/i18n/locales/bzk/home.ts
// Inglés criollo de Nicaragua. Convenciones y glosario: docs/i18n-creole.md
import type { home as spanish } from '../es/home';

export const home: typeof spanish = {
  greetingPrefix: 'Hello,',
  statusTitle: 'How yu de today',
  statusHeadline: 'Yu de go di right way!',
  statusSubtitle: 'Keep it up, keep yu healthy habits',
  quickActions: {
    appointments: { title: 'Appointments', subtitle: 'Book an manage' },
    medications: { title: 'Medicine', subtitle: 'Track an prescriptions' },
    indicators: { title: 'Indicators', subtitle: 'Health metrics' },
    medicalRecord: { title: 'Health Record', subtitle: 'Medical history' },
  },
};
