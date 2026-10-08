import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Verificación en dos pasos por OTP: la tabla `otp_challenge` y la bandera
 * `user.two_factor_enabled`.
 *
 * El SQL lo generó `migration:generate` contra el esquema anterior, así que los
 * nombres de constraints e índices son los que TypeORM espera y
 * `migration:check` no detecta deriva.
 *
 * `up` y `down` son **idempotentes** a propósito. Mientras la API siga con
 * `synchronize: true`, el arranque ya crea estos objetos por su cuenta, y esta
 * migración puede llegar después sobre una base que ya los tiene. En ese caso
 * solo queda registrada en la tabla `migrations`, sin tocar el esquema.
 */
export class AddTwoFactorOtp1791480843660 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('user'))) {
      // No hay baseline en esta rama: la tabla `user` la crea `synchronize` (o
      // la migración InitialSchema de `feat/ipcp`). Fallar con un mensaje claro
      // es mejor que un "relation user does not exist" a mitad de la migración.
      throw new Error(
        'La tabla "user" no existe: esta migración parte de un esquema ya creado. ' +
          'Arranca la API una vez (synchronize) o aplica antes la migración baseline.',
      );
    }

    if (!(await queryRunner.hasTable('otp_challenge'))) {
      await queryRunner.query(
        `CREATE TABLE "otp_challenge" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "purpose" character varying(20) NOT NULL, "code_hash" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "attempts" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_200fe6e81812616e7f97690cb21" PRIMARY KEY ("id"))`,
      );
      await queryRunner.query(
        `CREATE INDEX "IDX_08223e61a4b8a386b55a8010f0" ON "otp_challenge"  ("user_id", "purpose") `,
      );
      await queryRunner.query(
        `ALTER TABLE "otp_challenge" ADD CONSTRAINT "FK_b6a3963bedad02f9d881214edbf" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      );
    }

    if (!(await queryRunner.hasColumn('user', 'two_factor_enabled'))) {
      await queryRunner.query(
        `ALTER TABLE "user" ADD "two_factor_enabled" boolean NOT NULL DEFAULT false`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Al borrar la tabla caen también su índice y su clave foránea.
    if (await queryRunner.hasTable('otp_challenge')) {
      await queryRunner.query(`DROP TABLE "otp_challenge"`);
    }
    if (await queryRunner.hasColumn('user', 'two_factor_enabled')) {
      await queryRunner.query(
        `ALTER TABLE "user" DROP COLUMN "two_factor_enabled"`,
      );
    }
  }
}
