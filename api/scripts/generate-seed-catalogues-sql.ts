/**
 * Genera el cuerpo de la migración `SeedCatalogues` desde `seed-data.ts`.
 *
 * Herramienta de un solo uso: se ejecutó para producir la migración y **solo se
 * versiona el SQL resultante**. Existe porque el volumen es alto (150 municipios
 * y 17 bandas): transcribirlo a mano invite a errores que no se verían hasta que
 * faltara un municipio en el formulario.
 *
 * Para auditar que el SQL coincide con `seed-data.ts` está la prueba
 * `seed-catalogues-migration.spec.ts`, que corre en cada `pnpm test`.
 *
 *   pnpm exec ts-node scripts/generate-seed-catalogues-sql.ts
 */
import {
  APPOINTMENT_STATES,
  APPOINTMENT_TYPES,
  CLINICAL_RANGES,
  CLINICAL_RANGE_BANDS,
  DEPARTMENTS,
  GENRES,
  HEALTH_CENTER_TYPES,
  MAJORS,
  NOTIFICATION_STATES,
  RELATIONSHIP_TYPES,
  ROLES,
  ROUTE_ADMINISTRATIONS,
  TYPE_INDICATORS,
} from '../src/database/seed-data';

/** Escapa comillas simples para un literal de Postgres. */
function lit(value: string | number): string {
  return `'${String(value).replace(/'/g, "''")}'`;
}

/** Literal numérico, o `NULL` cuando el extremo es abierto. */
function num(value: number | null): string {
  return value === null ? 'NULL' : String(value);
}

/**
 * Envoltura de una sentencia para el cuerpo de la migración.
 * Todas son idempotentes: la migración anterior añadió `UNIQUE` en `name`, así
 * que `ON CONFLICT DO NOTHING` es seguro incluso con dos procesos a la vez.
 */
function q(sql: string): string {
  return `        await queryRunner.query(\`${sql}\`);`;
}

/** Catálogo simple de una sola columna `name`. */
function simple(table: string, names: readonly string[]): string[] {
  return names.map((n) => q(`INSERT INTO "${table}" ("name") VALUES (${lit(n)}) ON CONFLICT ("name") DO NOTHING`));
}

const lines: string[] = [];
const section = (title: string) => lines.push('', `        // --- ${title} ---`);

section('Roles');
for (const role of ROLES) {
  lines.push(
    q(`INSERT INTO "cat_role" ("name", "code") VALUES (${lit(role.name)}, ${lit(role.code)}) ON CONFLICT ("code") DO NOTHING`),
  );
}

section('Géneros');
lines.push(...simple('cat_genre', GENRES));

section('Profesiones');
lines.push(...simple('cat_major', MAJORS));

section('Tipos de centro de salud');
lines.push(...simple('cat_health_center_type', HEALTH_CENTER_TYPES));

section('Tipos de parentesco');
lines.push(...simple('cat_relationship_type', RELATIONSHIP_TYPES));

section('Tipos de indicador');
for (const type of TYPE_INDICATORS) {
  lines.push(
    q(`INSERT INTO "cat_type_indicator" ("name", "measurement_unit") VALUES (${lit(type.name)}, ${lit(type.measurementUnit)}) ON CONFLICT ("name") DO NOTHING`),
  );
}

section('Estados de cita');
lines.push(...simple('cat_appointment_state', APPOINTMENT_STATES));

section('Tipos de cita');
lines.push(...simple('cat_appointment_type', APPOINTMENT_TYPES));

section('Estados de notificación');
lines.push(...simple('cat_notification_state', NOTIFICATION_STATES));

section('Vías de administración');
lines.push(...simple('cat_route_administration', ROUTE_ADMINISTRATIONS));

section('Departamentos y municipios');
for (const dept of DEPARTMENTS) {
  lines.push(
    q(`INSERT INTO "cat_department" ("name") VALUES (${lit(dept.name)}) ON CONFLICT ("name") DO NOTHING`),
  );
  for (const muni of dept.municipalities) {
    // El `department_id` se resuelve por subconsulta y no por id fijo: los ids
    // dependen del orden de inserción y serían distintos en cada base.
    lines.push(
      q(`INSERT INTO "cat_municipality" ("name", "department_id") SELECT ${lit(muni)}, "id" FROM "cat_department" WHERE "name" = ${lit(dept.name)} ON CONFLICT ("name") DO NOTHING`),
    );
  }
}

section('Rangos clínicos');
for (const range of CLINICAL_RANGES) {
  lines.push(
    q(`INSERT INTO "clinical_range" ("type_indicator_id", "min_value", "max_value", "min_value_secondary", "max_value_secondary") SELECT "id", ${num(range.minValue)}, ${num(range.maxValue)}, ${num(range.minValueSecondary)}, ${num(range.maxValueSecondary)} FROM "cat_type_indicator" WHERE "name" = ${lit(range.typeIndicatorName)} ON CONFLICT ("type_indicator_id") DO NOTHING`),
  );
}

section('Bandas de gravedad clínica');
// `sequence` ordena la evaluación: 1 = extremo más bajo. Es un contador por
// (indicador, value_kind), igual que hacía el seeder, para que el orden en
// `seed-data.ts` sea el orden de evaluación.
const lastSequence = new Map<string, number>();
for (const band of CLINICAL_RANGE_BANDS) {
  const key = `${band.typeIndicatorName}:${band.valueKind}`;
  const sequence = (lastSequence.get(key) ?? 0) + 1;
  lastSequence.set(key, sequence);
  lines.push(
    q(`INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", ${sequence}, ${lit(band.label)}, ${lit(band.severity)}, ${lit(band.valueKind)}, ${num(band.minValue)}, ${num(band.maxValue)} FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = ${lit(band.typeIndicatorName)} ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`),
  );
}

console.log(lines.join('\n'));