// lib/accessibility-theme.ts
// Aplica en toda la app el tamaño de texto y el alto contraste cambiando, en
// tiempo de ejecución, las variables CSS que usan las clases de uniwind
// (`text-body`, `text-muted-foreground`, `border-border`…).
import { Uniwind } from 'uniwind';
import type { TextSize } from '@/types/preferences';

type CssVariables = Record<string, string | number>;
type ThemeName = (typeof Uniwind.themes)[number];

const TEXT_SCALE: Record<TextSize, number> = { normal: 1, large: 1.15, xlarge: 1.3 };

/** Espejo de la escala tipográfica de global.css: [tamaño, interlineado] en px. */
const TEXT_STEPS: Record<string, readonly [number, number]> = {
  h1: [48, 56],
  h2: [32, 40],
  h3: [24, 32],
  body: [16, 24],
  small: [14, 20],
  button: [16, 20],
  caption: [12, 16],
};

/** Redondea a medio píxel para no generar tamaños con decimales raros. */
const round = (value: number) => Math.round(value * 2) / 2;

export function buildTextVariables(textSize: TextSize): CssVariables {
  const scale = TEXT_SCALE[textSize];
  const variables: CssVariables = {};
  for (const [name, [size, lineHeight]] of Object.entries(TEXT_STEPS)) {
    variables[`--text-${name}`] = round(size * scale);
    variables[`--text-${name}--line-height`] = round(lineHeight * scale);
  }
  return variables;
}

// Valores originales (global.css) de las variables que cambia el alto contraste,
// para poder restaurarlas al desactivarlo.
const NORMAL_COLORS: Record<ThemeName, CssVariables> = {
  light: {
    '--color-foreground': '#1a2129',
    '--color-muted-foreground': '#6b7280',
    '--color-border': '#d9d9d9',
    '--color-input': '#d9d9d9',
    '--color-primary': '#2db79a',
    '--color-neutral-medium': '#6b7280',
    '--color-secondary-steel': '#2d7f8e',
  },
  dark: {
    '--color-foreground': '#ffffff',
    '--color-muted-foreground': '#d9d9d9',
    '--color-border': '#135e6d',
    '--color-input': '#135e6d',
    '--color-primary': '#2db79a',
    '--color-neutral-medium': '#6b7280',
    '--color-secondary-steel': '#2d7f8e',
  },
};

const HIGH_CONTRAST_COLORS: Record<ThemeName, CssVariables> = {
  light: {
    '--color-foreground': '#000000',
    '--color-muted-foreground': '#374151',
    '--color-border': '#6b7280',
    '--color-input': '#6b7280',
    '--color-primary': '#0f766e',
    '--color-neutral-medium': '#374151',
    '--color-secondary-steel': '#1d5f6d',
  },
  dark: {
    '--color-foreground': '#ffffff',
    '--color-muted-foreground': '#ffffff',
    '--color-border': '#77d1b5',
    '--color-input': '#77d1b5',
    '--color-primary': '#4fd6b8',
    '--color-neutral-medium': '#d1d5db',
    '--color-secondary-steel': '#9be0d0',
  },
};

// true mientras haya variables cambiadas respecto a global.css que haya que restaurar
let hasOverrides = false;

export function applyAccessibilityTheme(textSize: TextSize, highContrast: boolean) {
  const isDefault = textSize === 'normal' && !highContrast;
  // con los ajustes por defecto y sin nada que restaurar, global.css ya es la verdad
  if (isDefault && !hasOverrides) return;
  hasOverrides = !isDefault;

  const textVariables = buildTextVariables(textSize);
  for (const theme of Uniwind.themes) {
    const colors = highContrast ? HIGH_CONTRAST_COLORS[theme] : NORMAL_COLORS[theme];
    Uniwind.updateCSSVariables(theme, { ...textVariables, ...colors });
  }
}
