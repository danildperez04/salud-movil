import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { diskStorage } from 'multer';
import { LocalReleaseStorage } from './release-storage';

/** Carpeta de los instaladores; en Docker es un volumen (ver docker-compose.yml). */
export const RELEASES_DIR = process.env.RELEASES_DIR || './storage/releases';

const MAX_MB = parseInt(process.env.RELEASE_MAX_MB ?? '500', 10);
export const RELEASE_MAX_BYTES = MAX_MB * 1024 * 1024;

export const releaseStorage = new LocalReleaseStorage(RELEASES_DIR);

/**
 * Opciones de multer para la subida. El archivo se escribe a disco en streaming
 * (nunca entero en memoria: un DMG puede pesar cientos de MB) dentro de `.tmp`,
 * junto al destino final para que mover el archivo sea un `rename` atómico.
 */
export const releaseUploadOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      mkdirSync(releaseStorage.tempDir, { recursive: true });
      cb(null, releaseStorage.tempDir);
    },
    filename: (_req, _file, cb) => cb(null, randomUUID()),
  }),
  limits: { files: 1, fileSize: RELEASE_MAX_BYTES },
};
