import type { ReleasePlatform } from '../types';

export const PLATFORMS: ReleasePlatform[] = ['android', 'windows', 'macos'];

export const PLATFORM_LABELS: Record<ReleasePlatform, string> = {
  android: 'Android',
  windows: 'Windows',
  macos: 'macOS',
};

/** Extensión del instalable de cada plataforma (igual que valida el API). */
export const PLATFORM_EXTENSIONS: Record<ReleasePlatform, string> = {
  android: '.apk',
  windows: '.exe',
  macos: '.dmg',
};

/** Tamaño máximo que anuncia el formulario; el límite real lo impone el servidor. */
export const MAX_UPLOAD_MB = 500;
