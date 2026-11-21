// lib/i18n/locales/bzk/login.ts
// Inglés criollo de Nicaragua. Convenciones y glosario: docs/i18n-creole.md
import type { login as spanish } from '../es/login';

export const login: typeof spanish = {
  brand: 'Salud Móvil',
  tagline: 'Yu health, in yu hands',
  title: 'Log In',
  subtitle: 'Put in yu details fi continue',
  emailLabel: 'Email',
  emailPlaceholder: 'yu@email.com',
  passwordLabel: 'Password',
  forgotPassword: 'Yu forget yu password?',
  submit: 'Log In',
  emailRequired: 'Put in yu email',
  emailInvalid: 'Dat email no right',
  passwordRequired: 'Put in yu password',
  invalidCredentials: 'Email or password no right',
  twoFactor: {
    title: 'Verify who yu are',
    subtitle: 'Put in di 6-digit code wi send yu fi finish logging in.',
    codeLabel: 'Verification code',
    codePlaceholder: '000000',
    submit: 'Verify',
    expiresIn: 'Di code expire in {{time}}',
    expired: 'Di code done expire. Ask fi a new one fi continue.',
    resend: 'Send code agen',
    resendIn: 'Send code agen in {{seconds}} s',
    resent: 'Wi send yu a new code. Di old one no work no more.',
    backToLogin: 'Go back fi log in',
    errors: {
      codeRequired: 'Put in di code',
      codeInvalid: 'Di code have 6 digits',
      wrongOrExpired: 'Di code wrong or it done expire. Check it or ask fi a new one.',
      tooManyRequests: 'Yu try too many times. Wait a likl while an try agen.',
      resendTooSoon: 'Wait a few seconds before yu ask fi another code.',
      challengeGone: 'Di verification no available no more. Go back an log in agen.',
    },
  },
};
