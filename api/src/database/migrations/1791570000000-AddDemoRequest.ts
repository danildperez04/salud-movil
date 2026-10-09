import { MigrationInterface, QueryRunner } from 'typeorm';

/** Solicitudes de demostración que llegan del formulario público de la landing. */
export class AddDemoRequest1791570000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "demo_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "email" character varying(160) NOT NULL, "organization" character varying(160) NOT NULL, "job_title" character varying(120), "phone_number" character varying(30), "message" text, "status" character varying(12) NOT NULL DEFAULT 'pending', "admin_notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_demo_request" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_demo_request_status_created_at" ON "demo_request" ("status", "created_at") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "demo_request"`);
  }
}
