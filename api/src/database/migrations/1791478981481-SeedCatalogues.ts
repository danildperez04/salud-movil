import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Datos de referencia de los 14 catálogos.
 *
 * Hasta aquí las migraciones solo creaban tablas: los catálogos los sembraba el
 * `SeedService` al arrancar la API. Con `synchronize: false` eso significaba
 * que una base migrada no era utilizable sin arrancar el servicio, y que el
 * contenido de los catálogos no estaba versionado junto al esquema.
 *
 * Todas las sentencias son idempotentes (`ON CONFLICT DO NOTHING`), apoyadas en
 * las restricciones `UNIQUE` de la migración anterior. Aplicarla dos veces, o
 * sobre una base ya sembrada por el seeder, no cambia nada.
 *
 * Los identificadores ajenos se resuelven por subconsulta sobre el nombre, nunca
 * con ids fijos: los ids dependen del orden de inserción y serían distintos en
 * cada base.
 *
 * Las bandas de gravedad clínica llevan cortes PROVISIONALES, pendientes de
 * validación médica.
 *
 * Este SQL se generó con `scripts/generate-seed-catalogues-sql.ts` desde
 * `seed-data.ts` y queda congelado a partir de aquí, como toda migración.
 * `seed-catalogues-migration.spec.ts` verifica que ambos no diverjan.
 */
export class SeedCatalogues1791478981481 implements MigrationInterface {
  name = 'SeedCatalogues1791478981481';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- Roles ---
    await queryRunner.query(
      `INSERT INTO "cat_role" ("name", "code") VALUES ('Paciente', 'patient') ON CONFLICT ("code") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_role" ("name", "code") VALUES ('Cuidador', 'caregiver') ON CONFLICT ("code") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_role" ("name", "code") VALUES ('Personal de Salud', 'health_staff') ON CONFLICT ("code") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_role" ("name", "code") VALUES ('Administrador', 'admin') ON CONFLICT ("code") DO NOTHING`,
    );

    // --- Géneros ---
    await queryRunner.query(
      `INSERT INTO "cat_genre" ("name") VALUES ('Masculino') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_genre" ("name") VALUES ('Femenino') ON CONFLICT ("name") DO NOTHING`,
    );

    // --- Profesiones ---
    await queryRunner.query(
      `INSERT INTO "cat_major" ("name") VALUES ('Medicina General') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_major" ("name") VALUES ('Enfermería') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_major" ("name") VALUES ('Psicología') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_major" ("name") VALUES ('Nutrición') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_major" ("name") VALUES ('Fisioterapia') ON CONFLICT ("name") DO NOTHING`,
    );

    // --- Tipos de centro de salud ---
    await queryRunner.query(
      `INSERT INTO "cat_health_center_type" ("name") VALUES ('Hospital') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_health_center_type" ("name") VALUES ('Centro de Salud') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_health_center_type" ("name") VALUES ('Puesto de Salud') ON CONFLICT ("name") DO NOTHING`,
    );

    // --- Tipos de parentesco ---
    await queryRunner.query(
      `INSERT INTO "cat_relationship_type" ("name") VALUES ('Padre/Madre') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_relationship_type" ("name") VALUES ('Hijo(a)') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_relationship_type" ("name") VALUES ('Cónyuge') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_relationship_type" ("name") VALUES ('Cuidador profesional') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_relationship_type" ("name") VALUES ('Otro familiar') ON CONFLICT ("name") DO NOTHING`,
    );

    // --- Tipos de indicador ---
    await queryRunner.query(
      `INSERT INTO "cat_type_indicator" ("name", "measurement_unit") VALUES ('Blood pressure', 'mmHg') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_type_indicator" ("name", "measurement_unit") VALUES ('Glucose', 'mg/dL') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_type_indicator" ("name", "measurement_unit") VALUES ('Weight', 'kg') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_type_indicator" ("name", "measurement_unit") VALUES ('Temperature', '°C') ON CONFLICT ("name") DO NOTHING`,
    );

    // --- Estados de cita ---
    await queryRunner.query(
      `INSERT INTO "cat_appointment_state" ("name") VALUES ('Scheduled') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_appointment_state" ("name") VALUES ('Cancelled') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_appointment_state" ("name") VALUES ('Completed') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_appointment_state" ("name") VALUES ('No show') ON CONFLICT ("name") DO NOTHING`,
    );

    // --- Tipos de cita ---
    await queryRunner.query(
      `INSERT INTO "cat_appointment_type" ("name") VALUES ('First visit') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_appointment_type" ("name") VALUES ('Follow-up') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_appointment_type" ("name") VALUES ('Check-up') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_appointment_type" ("name") VALUES ('Other') ON CONFLICT ("name") DO NOTHING`,
    );

    // --- Estados de notificación ---
    await queryRunner.query(
      `INSERT INTO "cat_notification_state" ("name") VALUES ('Pending') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_notification_state" ("name") VALUES ('Sent') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_notification_state" ("name") VALUES ('Confirmed') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_notification_state" ("name") VALUES ('Failed') ON CONFLICT ("name") DO NOTHING`,
    );

    // --- Vías de administración ---
    await queryRunner.query(
      `INSERT INTO "cat_route_administration" ("name") VALUES ('Oral') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_route_administration" ("name") VALUES ('Intravenous') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_route_administration" ("name") VALUES ('Subcutaneous') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_route_administration" ("name") VALUES ('Topical') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_route_administration" ("name") VALUES ('Inhaled') ON CONFLICT ("name") DO NOTHING`,
    );

    // --- Departamentos y municipios ---
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Boaco') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Boaco', "id" FROM "cat_department" WHERE "name" = 'Boaco' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Camoapa', "id" FROM "cat_department" WHERE "name" = 'Boaco' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San José de los Remates', "id" FROM "cat_department" WHERE "name" = 'Boaco' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Lorenzo', "id" FROM "cat_department" WHERE "name" = 'Boaco' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Santa Lucía', "id" FROM "cat_department" WHERE "name" = 'Boaco' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Teustepe', "id" FROM "cat_department" WHERE "name" = 'Boaco' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Carazo') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Diriamba', "id" FROM "cat_department" WHERE "name" = 'Carazo' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Dolores', "id" FROM "cat_department" WHERE "name" = 'Carazo' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'El Rosario', "id" FROM "cat_department" WHERE "name" = 'Carazo' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Jinotepe', "id" FROM "cat_department" WHERE "name" = 'Carazo' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'La Conquista', "id" FROM "cat_department" WHERE "name" = 'Carazo' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'La Paz de Carazo', "id" FROM "cat_department" WHERE "name" = 'Carazo' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Marcos', "id" FROM "cat_department" WHERE "name" = 'Carazo' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Santa Teresa', "id" FROM "cat_department" WHERE "name" = 'Carazo' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Chinandega') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Chichigalpa', "id" FROM "cat_department" WHERE "name" = 'Chinandega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Chinandega', "id" FROM "cat_department" WHERE "name" = 'Chinandega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Cinco Pinos', "id" FROM "cat_department" WHERE "name" = 'Chinandega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Corinto', "id" FROM "cat_department" WHERE "name" = 'Chinandega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'El Realejo', "id" FROM "cat_department" WHERE "name" = 'Chinandega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'El Viejo', "id" FROM "cat_department" WHERE "name" = 'Chinandega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Posoltega', "id" FROM "cat_department" WHERE "name" = 'Chinandega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Puerto Morazán', "id" FROM "cat_department" WHERE "name" = 'Chinandega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Francisco del Norte', "id" FROM "cat_department" WHERE "name" = 'Chinandega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Pedro del Norte', "id" FROM "cat_department" WHERE "name" = 'Chinandega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Santo Tomás del Norte', "id" FROM "cat_department" WHERE "name" = 'Chinandega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Somotillo', "id" FROM "cat_department" WHERE "name" = 'Chinandega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Villanueva', "id" FROM "cat_department" WHERE "name" = 'Chinandega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Chontales') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Acoyapa', "id" FROM "cat_department" WHERE "name" = 'Chontales' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Comalapa', "id" FROM "cat_department" WHERE "name" = 'Chontales' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'El Coral', "id" FROM "cat_department" WHERE "name" = 'Chontales' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Juigalpa', "id" FROM "cat_department" WHERE "name" = 'Chontales' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'La Libertad', "id" FROM "cat_department" WHERE "name" = 'Chontales' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Francisco de Cuapa', "id" FROM "cat_department" WHERE "name" = 'Chontales' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Pedro de Lóvago', "id" FROM "cat_department" WHERE "name" = 'Chontales' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Santo Domingo', "id" FROM "cat_department" WHERE "name" = 'Chontales' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Santo Tomás', "id" FROM "cat_department" WHERE "name" = 'Chontales' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Estelí') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Condega', "id" FROM "cat_department" WHERE "name" = 'Estelí' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Estelí', "id" FROM "cat_department" WHERE "name" = 'Estelí' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'La Trinidad', "id" FROM "cat_department" WHERE "name" = 'Estelí' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Pueblo Nuevo', "id" FROM "cat_department" WHERE "name" = 'Estelí' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Juan de Limay', "id" FROM "cat_department" WHERE "name" = 'Estelí' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Nicolás', "id" FROM "cat_department" WHERE "name" = 'Estelí' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Granada') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Diriá', "id" FROM "cat_department" WHERE "name" = 'Granada' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Diriomo', "id" FROM "cat_department" WHERE "name" = 'Granada' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Granada', "id" FROM "cat_department" WHERE "name" = 'Granada' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Nandaime', "id" FROM "cat_department" WHERE "name" = 'Granada' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Jinotega') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'El Cuá', "id" FROM "cat_department" WHERE "name" = 'Jinotega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Jinotega', "id" FROM "cat_department" WHERE "name" = 'Jinotega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'La Concordia', "id" FROM "cat_department" WHERE "name" = 'Jinotega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San José de Bocay', "id" FROM "cat_department" WHERE "name" = 'Jinotega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Rafael del Norte', "id" FROM "cat_department" WHERE "name" = 'Jinotega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Sebastián de Yalí', "id" FROM "cat_department" WHERE "name" = 'Jinotega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Santa María de Pantasma', "id" FROM "cat_department" WHERE "name" = 'Jinotega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Wiwilí de Jinotega', "id" FROM "cat_department" WHERE "name" = 'Jinotega' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('León') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Achuapa', "id" FROM "cat_department" WHERE "name" = 'León' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'El Jicaral', "id" FROM "cat_department" WHERE "name" = 'León' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'El Sauce', "id" FROM "cat_department" WHERE "name" = 'León' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'La Paz Centro', "id" FROM "cat_department" WHERE "name" = 'León' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Larreynaga (Malpaisillo)', "id" FROM "cat_department" WHERE "name" = 'León' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'León', "id" FROM "cat_department" WHERE "name" = 'León' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Nagarote', "id" FROM "cat_department" WHERE "name" = 'León' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Quezalguaque', "id" FROM "cat_department" WHERE "name" = 'León' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Santa Rosa del Peñón', "id" FROM "cat_department" WHERE "name" = 'León' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Telica', "id" FROM "cat_department" WHERE "name" = 'León' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Madriz') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Las Sabanas', "id" FROM "cat_department" WHERE "name" = 'Madriz' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Palacagüina', "id" FROM "cat_department" WHERE "name" = 'Madriz' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San José de Cusmapa', "id" FROM "cat_department" WHERE "name" = 'Madriz' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Juan de Río Coco', "id" FROM "cat_department" WHERE "name" = 'Madriz' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Lucas', "id" FROM "cat_department" WHERE "name" = 'Madriz' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Somoto', "id" FROM "cat_department" WHERE "name" = 'Madriz' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Telpaneca', "id" FROM "cat_department" WHERE "name" = 'Madriz' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Totogalpa', "id" FROM "cat_department" WHERE "name" = 'Madriz' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Yalagüina', "id" FROM "cat_department" WHERE "name" = 'Madriz' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Managua') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Ciudad Sandino', "id" FROM "cat_department" WHERE "name" = 'Managua' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'El Crucero', "id" FROM "cat_department" WHERE "name" = 'Managua' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Managua', "id" FROM "cat_department" WHERE "name" = 'Managua' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Mateare', "id" FROM "cat_department" WHERE "name" = 'Managua' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Francisco Libre', "id" FROM "cat_department" WHERE "name" = 'Managua' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Rafael del Sur', "id" FROM "cat_department" WHERE "name" = 'Managua' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Ticuantepe', "id" FROM "cat_department" WHERE "name" = 'Managua' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Tipitapa', "id" FROM "cat_department" WHERE "name" = 'Managua' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Villa El Carmen', "id" FROM "cat_department" WHERE "name" = 'Managua' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Masaya') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Catarina', "id" FROM "cat_department" WHERE "name" = 'Masaya' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'La Concepción', "id" FROM "cat_department" WHERE "name" = 'Masaya' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Masatepe', "id" FROM "cat_department" WHERE "name" = 'Masaya' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Masaya', "id" FROM "cat_department" WHERE "name" = 'Masaya' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Nandasmo', "id" FROM "cat_department" WHERE "name" = 'Masaya' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Nindirí', "id" FROM "cat_department" WHERE "name" = 'Masaya' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Niquinohomo', "id" FROM "cat_department" WHERE "name" = 'Masaya' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Juan de Oriente', "id" FROM "cat_department" WHERE "name" = 'Masaya' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Tisma', "id" FROM "cat_department" WHERE "name" = 'Masaya' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Matagalpa') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Ciudad Darío', "id" FROM "cat_department" WHERE "name" = 'Matagalpa' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Esquipulas', "id" FROM "cat_department" WHERE "name" = 'Matagalpa' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Matagalpa', "id" FROM "cat_department" WHERE "name" = 'Matagalpa' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Matiguás', "id" FROM "cat_department" WHERE "name" = 'Matagalpa' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Muy Muy', "id" FROM "cat_department" WHERE "name" = 'Matagalpa' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Rancho Grande', "id" FROM "cat_department" WHERE "name" = 'Matagalpa' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Río Blanco', "id" FROM "cat_department" WHERE "name" = 'Matagalpa' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Dionisio', "id" FROM "cat_department" WHERE "name" = 'Matagalpa' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Isidro', "id" FROM "cat_department" WHERE "name" = 'Matagalpa' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Ramón', "id" FROM "cat_department" WHERE "name" = 'Matagalpa' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Sébaco', "id" FROM "cat_department" WHERE "name" = 'Matagalpa' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Terrabona', "id" FROM "cat_department" WHERE "name" = 'Matagalpa' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Tuma-La Dalia', "id" FROM "cat_department" WHERE "name" = 'Matagalpa' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Nueva Segovia') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Ciudad Antigua', "id" FROM "cat_department" WHERE "name" = 'Nueva Segovia' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Dipilto', "id" FROM "cat_department" WHERE "name" = 'Nueva Segovia' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'El Jícaro', "id" FROM "cat_department" WHERE "name" = 'Nueva Segovia' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Jalapa', "id" FROM "cat_department" WHERE "name" = 'Nueva Segovia' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Macuelizo', "id" FROM "cat_department" WHERE "name" = 'Nueva Segovia' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Mozonte', "id" FROM "cat_department" WHERE "name" = 'Nueva Segovia' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Murra', "id" FROM "cat_department" WHERE "name" = 'Nueva Segovia' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Ocotal', "id" FROM "cat_department" WHERE "name" = 'Nueva Segovia' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Quilalí', "id" FROM "cat_department" WHERE "name" = 'Nueva Segovia' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Fernando', "id" FROM "cat_department" WHERE "name" = 'Nueva Segovia' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Santa María', "id" FROM "cat_department" WHERE "name" = 'Nueva Segovia' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Wiwilí de Nueva Segovia', "id" FROM "cat_department" WHERE "name" = 'Nueva Segovia' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Rivas') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Altagracia', "id" FROM "cat_department" WHERE "name" = 'Rivas' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Belén', "id" FROM "cat_department" WHERE "name" = 'Rivas' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Buenos Aires', "id" FROM "cat_department" WHERE "name" = 'Rivas' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Cárdenas', "id" FROM "cat_department" WHERE "name" = 'Rivas' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Moyogalpa', "id" FROM "cat_department" WHERE "name" = 'Rivas' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Potosí', "id" FROM "cat_department" WHERE "name" = 'Rivas' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Rivas', "id" FROM "cat_department" WHERE "name" = 'Rivas' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Jorge', "id" FROM "cat_department" WHERE "name" = 'Rivas' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Juan del Sur', "id" FROM "cat_department" WHERE "name" = 'Rivas' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Tola', "id" FROM "cat_department" WHERE "name" = 'Rivas' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Río San Juan') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'El Almendro', "id" FROM "cat_department" WHERE "name" = 'Río San Juan' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'El Castillo', "id" FROM "cat_department" WHERE "name" = 'Río San Juan' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Morrito', "id" FROM "cat_department" WHERE "name" = 'Río San Juan' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'San Carlos', "id" FROM "cat_department" WHERE "name" = 'Río San Juan' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Costa Caribe Norte') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Bonanza', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Norte' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Mulukukú', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Norte' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Prinzapolka', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Norte' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Puerto Cabezas', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Norte' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Rosita', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Norte' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Siuna', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Norte' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Waslala', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Norte' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Waspán', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Norte' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_department" ("name") VALUES ('Costa Caribe Sur') ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Bluefields', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Sur' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Corn Island', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Sur' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Desembocadura de la Cruz de Río Grande', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Sur' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'El Ayote', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Sur' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'El Rama', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Sur' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'El Tortuguero', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Sur' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Kukra Hill', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Sur' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'La Cruz de Río Grande', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Sur' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Laguna de Perlas', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Sur' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Muelle de los Bueyes', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Sur' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Nueva Guinea', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Sur' ON CONFLICT ("name") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "cat_municipality" ("name", "department_id") SELECT 'Paiwas', "id" FROM "cat_department" WHERE "name" = 'Costa Caribe Sur' ON CONFLICT ("name") DO NOTHING`,
    );

    // --- Rangos clínicos ---
    await queryRunner.query(
      `INSERT INTO "clinical_range" ("type_indicator_id", "min_value", "max_value", "min_value_secondary", "max_value_secondary") SELECT "id", 90, 139, 60, 89 FROM "cat_type_indicator" WHERE "name" = 'Blood pressure' ON CONFLICT ("type_indicator_id") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range" ("type_indicator_id", "min_value", "max_value", "min_value_secondary", "max_value_secondary") SELECT "id", 70, 126, NULL, NULL FROM "cat_type_indicator" WHERE "name" = 'Glucose' ON CONFLICT ("type_indicator_id") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range" ("type_indicator_id", "min_value", "max_value", "min_value_secondary", "max_value_secondary") SELECT "id", 35.5, 37.5, NULL, NULL FROM "cat_type_indicator" WHERE "name" = 'Temperature' ON CONFLICT ("type_indicator_id") DO NOTHING`,
    );

    // --- Bandas de gravedad clínica ---
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 1, 'Sistólica crítica', 'critical', 'primary', 160, NULL FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Blood pressure' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 2, 'Sistólica elevada', 'alert', 'primary', 140, 159.99 FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Blood pressure' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 3, 'Sistólica normal', 'normal', 'primary', 90, 139.99 FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Blood pressure' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 4, 'Sistólica baja', 'alert', 'primary', NULL, 89.99 FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Blood pressure' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 1, 'Diastólica crítica', 'critical', 'secondary', 110, NULL FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Blood pressure' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 2, 'Diastólica elevada', 'alert', 'secondary', 90, 109.99 FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Blood pressure' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 3, 'Diastólica normal', 'normal', 'secondary', 60, 89.99 FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Blood pressure' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 4, 'Diastólica baja', 'alert', 'secondary', NULL, 59.99 FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Blood pressure' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 1, 'Glucosa crítica', 'critical', 'primary', 200, NULL FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Glucose' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 2, 'Glucosa elevada', 'alert', 'primary', 126, 199.99 FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Glucose' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 3, 'Glucosa normal', 'normal', 'primary', 70, 125.99 FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Glucose' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 4, 'Glucosa baja', 'alert', 'primary', NULL, 69.99 FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Glucose' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 1, 'Fiebre alta', 'critical', 'primary', 39, NULL FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Temperature' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 2, 'Fiebre', 'alert', 'primary', 37.5, 38.99 FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Temperature' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 3, 'Temperatura normal', 'normal', 'primary', 35.5, 37.49 FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Temperature' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 4, 'Hipotermia leve', 'alert', 'primary', NULL, 35.49 FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Temperature' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
    await queryRunner.query(
      `INSERT INTO "clinical_range_band" ("clinical_range_id", "sequence", "label", "severity", "value_kind", "min_value", "max_value") SELECT r."id", 5, 'Hipotermia', 'critical', 'primary', NULL, 35 FROM "clinical_range" r JOIN "cat_type_indicator" t ON t."id" = r."type_indicator_id" WHERE t."name" = 'Temperature' ON CONFLICT ("clinical_range_id", "value_kind", "sequence") DO NOTHING`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No se vacían los catálogos: las tablas de negocio los referencian con
    // `RESTRICT`, así que borrarlos dejaría la base inservible. Revertir
    // solo tiene sentido sobre una base vacía, y aun así se deja constancia
    // de que esta migración no tiene inversa real.
    await queryRunner.query(
      '-- SeedCatalogues: sin operación inversa (datos de referencia)',
    );
  }
}
