import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Restricción única en `name` para los 11 catálogos de referencia simples.
 *
 * Por qué: sin ella, sembrar de forma idempotente obliga a `WHERE NOT EXISTS`,
 * que tiene una ventana TOCTOU — dos procesos que arrancan a la vez ven la tabla
 * vacía y los dos insertan. Con `UNIQUE` se puede usar `ON CONFLICT (name) DO
 * NOTHING`, que es seguro ante concurrencia. También evita que el selector de
 * vías de administración del panel llegue a ofrecer "Oral" dos veces.
 *
 * Antes de aplicar: se comprobó que ninguna de las 11 tablas tenía duplicados,
 * y que los nombres de municipio son únicos también entre departamentos (la
 * identidad es global, no por departamento). Si algún día aparece un duplicado,
 * esta migración falla y hay que resolverlo **antes** de añadir la restricción:
 * un `UNIQUE` no se puede crear con filas repetidas.
 */
export class AddUniqueCatalogueNames1791477331345 implements MigrationInterface {
  name = 'AddUniqueCatalogueNames1791477331345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cat_department" ADD CONSTRAINT "UQ_d157fcf185a99972d9cceb13c82" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_municipality" ADD CONSTRAINT "UQ_b3efa789b09d739eb1a995567f3" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_relationship_type" ADD CONSTRAINT "UQ_47bb0e5609694fb13981cd82aa8" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_major" ADD CONSTRAINT "UQ_afac65692eef3dd6a2a91776230" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_health_center_type" ADD CONSTRAINT "UQ_82d0ff513d5adbb5421a7aea367" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_genre" ADD CONSTRAINT "UQ_5ab0912892674d1c0a0e052bbba" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_type_indicator" ADD CONSTRAINT "UQ_6e61c677dd3fb3eb184ca5e4ca4" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_route_administration" ADD CONSTRAINT "UQ_660d6b5a8f10efcad31efad64d5" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_notification_state" ADD CONSTRAINT "UQ_6b1357f5e8fd07676a730280c0d" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_appointment_state" ADD CONSTRAINT "UQ_c13485e0f3a1af29cb13077e5fb" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_appointment_type" ADD CONSTRAINT "UQ_a4d6e8f44b107d4353a969b9b7f" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cat_appointment_type" DROP CONSTRAINT "UQ_a4d6e8f44b107d4353a969b9b7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_appointment_state" DROP CONSTRAINT "UQ_c13485e0f3a1af29cb13077e5fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_notification_state" DROP CONSTRAINT "UQ_6b1357f5e8fd07676a730280c0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_route_administration" DROP CONSTRAINT "UQ_660d6b5a8f10efcad31efad64d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_type_indicator" DROP CONSTRAINT "UQ_6e61c677dd3fb3eb184ca5e4ca4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_genre" DROP CONSTRAINT "UQ_5ab0912892674d1c0a0e052bbba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_health_center_type" DROP CONSTRAINT "UQ_82d0ff513d5adbb5421a7aea367"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_major" DROP CONSTRAINT "UQ_afac65692eef3dd6a2a91776230"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_relationship_type" DROP CONSTRAINT "UQ_47bb0e5609694fb13981cd82aa8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_municipality" DROP CONSTRAINT "UQ_b3efa789b09d739eb1a995567f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_department" DROP CONSTRAINT "UQ_d157fcf185a99972d9cceb13c82"`,
    );
  }
}
