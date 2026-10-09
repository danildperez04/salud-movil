/** Sistemas operativos para los que se publica un instalable. */
export const RELEASE_PLATFORMS = ['android', 'macos', 'windows'] as const;
export type ReleasePlatform = (typeof RELEASE_PLATFORMS)[number];

interface PlatformRule {
  /** Extensión del instalable, en minúsculas y con punto. */
  extension: string;
  mimeType: string;
  /**
   * Primeros bytes que debe tener el archivo. Detecta el error más común
   * (subir un archivo que no es el instalable) sin inspeccionar el contenido.
   * El DMG no tiene firma al inicio —el marcador `koly` va al final—, así que
   * en macOS solo se valida la extensión.
   */
  magic?: Buffer;
}

export const PLATFORM_RULES: Record<ReleasePlatform, PlatformRule> = {
  // Un APK es un ZIP.
  android: {
    extension: '.apk',
    mimeType: 'application/vnd.android.package-archive',
    magic: Buffer.from([0x50, 0x4b, 0x03, 0x04]),
  },
  macos: {
    extension: '.dmg',
    mimeType: 'application/x-apple-diskimage',
  },
  // Un ejecutable de Windows empieza con "MZ".
  windows: {
    extension: '.exe',
    mimeType: 'application/vnd.microsoft.portable-executable',
    magic: Buffer.from([0x4d, 0x5a]),
  },
};

export function isReleasePlatform(value: string): value is ReleasePlatform {
  return (RELEASE_PLATFORMS as readonly string[]).includes(value);
}
