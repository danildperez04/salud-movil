// lib/i18n/locales/bzk/accessibility.ts
// Inglés criollo de Nicaragua. Convenciones y glosario: docs/i18n-creole.md
import type { accessibility as spanish } from '../es/accessibility';

export const accessibility: typeof spanish = {
  textSizeTitle: 'Text size',
  textSizes: { normal: 'A', large: 'A+', xlarge: 'A++' },
  textSizeDescriptions: {
    normal: 'Normal text',
    large: 'Big text',
    xlarge: 'Very big text',
  },
  highContrast: {
    title: 'High contrast',
    subtitle: 'More difference between di text, borders an background',
  },
  reduceMotion: { title: 'Reduce movement', subtitle: 'No animations an visual effects' },
  simpleMode: {
    title: 'Simple reading mode',
    subtitle: 'Show less side info an less distractions',
  },
  readAloud: {
    title: 'Read aloud',
    subtitle: 'Read important instructions out loud when yu ask fi it',
  },
  testReading: 'Test read aloud',
  testReadingText:
    'Accessibility center. Yu can mek di text bigger, turn on high contrast, reduce movement or use simple reading.',
  reset: 'Reset settings',
};
