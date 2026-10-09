/**
 * Prepara la base de datos de los e2e y se niega a correr contra otra.
 *
 * Sin esto había dos problemas serios:
 *
 * 1. **Contaminación.** Los e2e importan el `AppModule` real, así que se
 *    conectaban a la base de *desarrollo* y dejaban dentro usuarios `e2e-*`,
 *    pacientes y citas. La base de desarrollo arrastraba datos de prueba.
 *
 * 2. **Esquema.** Con `synchronize: false` nada crea las tablas al arrancar, de
 *    modo que los e2e fallarían contra una base limpia (y en CI, que siempre es
 *    limpia). Por eso aquí se ejecutan las migraciones antes de la suite.
 *
 * El nombre de la base debe contener `test`. Es una barrera deliberada: es más
 * fácil undesired que romper el gating que acordar un segundo nombre para la
 * base de desarrollo.
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import dataSource from '../src/data-source';

/**
 * El nombre se lee del propio datasource, no de `process.env`: así la barrera
 * comprueba exactamente la base a la que se va a conectar, y no una que pueda
 * haber divergido por no haberse cargado el `.env`.
 */
const DB_NAME = dataSource.options.database as unknown as string;

function run(command: string): void {
  execSync(command, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
}

// Síncrono a propósito: `run()` usa `execSync`, así que no hay nada que
// esperar. Jest acepta un `globalSetup` que no devuelva promesa.
export default function globalSetup(): void {
  if (!DB_NAME.includes('test')) {
    throw new Error(
      [
        '',
        '⛔ Los e2e se niegan a correr contra una base que no sea de pruebas.',
        `   DB_NAME="${DB_NAME}" no contiene "test".`,
        '',
        '   Usa una base dedicada, por ejemplo:',
        '     DB_NAME=salud_movil_test DB_USER=... DB_PASSWORD=... pnpm test:e2e',
        '',
        '   La base de desarrollo no se toca: los e2e insertan datos reales.',
        '',
      ].join('\n'),
    );
  }

  if (!existsSync(path.resolve(__dirname, '../src/database/migrations'))) {
    throw new Error(
      'No se encuentra src/database/migrations: la CLI de migraciones no está disponible.',
    );
  }

  // El esquema lo crean las migraciones, no `synchronize`.
  console.log(`▸ Aplicando migraciones a la base de pruebas "${DB_NAME}"…`);
  run('pnpm migration:run');
}
