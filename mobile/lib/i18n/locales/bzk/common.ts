// lib/i18n/locales/bzk/common.ts
// Inglés criollo de Nicaragua. Convenciones y glosario: docs/i18n-creole.md
import type { common as spanish } from '../es/common';

export const common: typeof spanish = {
  loading: 'Loadin...',
  retry: 'Try agen',
  save: 'Save',
  cancel: 'Cancel',
  confirm: 'Confirm',
  noData: 'Nuttin fi show ya',
  back: 'Go back',
  externalLinkErrorTitle: "Wi couldn't open dat",
  externalLinkErrorMessage: 'Yu phone no have an app fi do dis.',
  comingSoonTitle: 'Coming soon',
  comingSoonDescription: 'Wi de work pon dis part. Soon yu go be able fi use it ya.',
  roles: {
    patient: 'Patient',
    caregiver: 'Caregiver',
    health_staff: 'Health staff',
    admin: 'Admin',
  },
  errors: {
    network: "Wi couldn't connect. Check yu internet an try agen.",
    timeout: 'It de tek more time dan usual. Try agen in a few seconds.',
    unexpected: 'Someting go wrong. Try agen.',
    invalidData: 'Check di info an try agen.',
    unauthorized: "Wi couldn't confirm who yu are. Log in agen.",
    forbidden: 'Yu no have permission fi do dis.',
    notFound: "Wi couldn't find wha yu de look fi.",
    conflict: "Di info change an wi couldn't finish. Refresh an try agen.",
    tooLarge: 'Di file too big. Choose a smaller one.',
    tooManyRequests: 'Yu try too many times. Wait a likl while an try agen.',
    unavailable: 'Wi have a problem pon wi side. Try agen in a few minutes.',
    screenCrash: {
      title: 'Someting go wrong',
      description: "Wi couldn't show dis screen. Try agen.",
    },
  },
};
