// lib/i18n/locales/bzk/more.ts
// Inglés criollo de Nicaragua. Convenciones y glosario: docs/i18n-creole.md
import type { more as spanish } from '../es/more';

export const more: typeof spanish = {
  title: 'More',
  fallbackName: 'User',
  comingSoon: 'Soon',
  logout: 'Log out',
  ipcp: {
    title: 'IPCP · Mi Priority',
    description: 'Yu priority level, worked out from yu indicators, medicine an appointments.',
    cta: 'See mi priority',
  },
  sections: {
    health: 'Health an follow-up',
    services: 'Extra services',
    accessibility: 'Accessibility an inclusion',
    preferences: 'Preferences',
    help: 'Help an safety',
  },
  items: {
    reminders: { title: 'Reminders', subtitle: 'Medicine an appointments' },
    medicalRecord: { title: 'Health Record', subtitle: 'Diagnoses, allergies an documents' },
    indicators: {
      title: 'Health Indicators',
      subtitle: 'Blood pressure, blood sugar, weight an more',
    },
    activity: { title: 'Exercise', subtitle: 'Record yu exercise fi keep track' },
    scanner: { title: 'Medicine Scanner', subtitle: 'Identify di box, use an warnings' },
    voice: { title: 'Voice Assistant', subtitle: 'Talk instead of typing' },
    referral: {
      title: 'Referral System',
      subtitle: 'Guide yu to di center wid di service yu need',
    },
    waitTimes: { title: 'Waiting Time', subtitle: 'Compare how long yu go wait' },
    healthMap: {
      title: 'Health Resources Map',
      subtitle: 'Hospitals, pharmacies an labs',
    },
    accessibilityCenter: {
      title: 'Accessibility Center',
      subtitle: 'Text, contrast, movement an reading',
    },
    language: { title: 'Language', subtitle: 'Spanish an Caribbean Coast languages' },
    notifications: { title: 'Notifications', subtitle: 'Medicine, appointments an health' },
    privacy: { title: 'Privacy an Security', subtitle: 'Access an data protection' },
    emergency: { title: 'Emergency Mode', subtitle: 'Medical info, contacts an location' },
    support: { title: 'Help an Support', subtitle: 'Common questions an contact' },
  },
};
