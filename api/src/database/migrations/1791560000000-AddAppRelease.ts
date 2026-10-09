import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Instaladores de la app (APK, DMG, EXE) que el admin sube desde el panel y la
 * landing ofrece para descargar. Los archivos no viven en la base: aquí solo
 * hay sus metadatos y la clave en el `ReleaseStorage`.
 */
export class AddAppRelease1791560000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "app_release" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "platform" character varying(10) NOT NULL, "version" character varying(40) NOT NULL, "notes" text, "file_key" character varying(60) NOT NULL, "file_name" character varying(120) NOT NULL, "size_bytes" bigint NOT NULL, "sha256" character(64) NOT NULL, "is_published" boolean NOT NULL DEFAULT true, "download_count" integer NOT NULL DEFAULT '0', "uploaded_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_app_release" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_app_release_platform_version" ON "app_release" ("platform", "version") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "app_release"`);
  }
}
