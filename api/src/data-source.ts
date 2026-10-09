// El `.env` lo carga `ConfigModule` en la app Nest, pero la CLI corre fuera de
// Nest, así que sin esto la migración apuntaría a la base por defecto en vez de
// a la del proyecto. `dotenv` es dependencia explícita por eso.
import 'dotenv/config';
import { DataSource } from 'typeorm';
import config from './config/configuration';

/**
 * DataSource para la CLI de TypeORM (`typeorm migration:generate|run|revert`).
 *
 * Vive aparte de `app.module.ts` porque Nest construye su propia conexión en
 * tiempo de ejecución y la CLI necesita una instancia suelta. Ambas leen la
 * misma configuración, así que no pueden divergir.
 *
 * ⚠️ `migration:generate` **no** debe apuntar a una base ya creada por
 * `synchronize`: no habría diferencias y generaría una migración vacía. Para
 * regenerar el baseline hay que apuntar `DB_NAME` a una base inexistente
 * (`scripts/migration-baseline.sh` lo hace).
 */
export default new DataSource({
  type: config().db.type,
  host: config().db.host,
  port: config().db.port,
  username: config().db.user,
  password: config().db.password,
  database: config().db.database,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  // Las migraciones se ejecutan explícitamente (`pnpm migration:run`), nunca
  // al arrancar. Sincronizar el esquema en el boot es lo que obliga a pausar
  // los despliegues, y esta es la razón de que exista este archivo.
  synchronize: false,
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});
