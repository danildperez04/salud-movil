import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1791251478149 implements MigrationInterface {
  // El nombre de la migración lo deriva TypeORM del nombre de la clase, y
  // exige que termine en un timestamp de 13 dígitos. Fijado aquí a mano para
  // que no cambie si alguien regenera el baseline: si el nombre se mueve, la
  // migración se correría dos veces sobre la misma base.
  //
  // No se declara `name = ...`: TypeORM valida ese campo y rechaza cualquier
  // cosa sin timestamp, incluso aunque la clase sí lo tenga.

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cat_role" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "code" character varying(20) NOT NULL, CONSTRAINT "UQ_4f2d089c7fa37029a35a9daad9f" UNIQUE ("code"), CONSTRAINT "PK_cbcd38b32d4c98b54f01d08db23" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cat_department" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_34c603f8d12355aa674e169ccb5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cat_municipality" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "department_id" integer NOT NULL, CONSTRAINT "PK_7f890f0f5ef054de0e30f4f7295" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cat_relationship_type" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_79bc3239c4851075c691cff8f01" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "patient_caregiver" ("patient_id" uuid NOT NULL, "caregiver_id" uuid NOT NULL, "date_link" date NOT NULL DEFAULT ('now'::text)::date, "is_primary" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "relationship_type_id" integer NOT NULL, CONSTRAINT "PK_0e16ca56af2b8e5ba14f46562e3" PRIMARY KEY ("patient_id", "caregiver_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "caregiver" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_114bf658fe2b416245381f89be0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cat_major" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_3f2d5912fef4d383673411647ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cat_health_center_type" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_46c6a8987c12acc894f661cf527" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "health_center" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying NOT NULL, "phone_number" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "health_center_type_id" integer NOT NULL, "municipality_id" integer NOT NULL, CONSTRAINT "PK_df9e1dae22a04cfddfb51b095ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "healthcare_worker" ("id" uuid NOT NULL, "license_number" character varying NOT NULL, "employee_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "major_id" integer NOT NULL, "health_center_id" uuid NOT NULL, CONSTRAINT "PK_c812183afd1dfcf872c50faf251" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "password_reset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token_hash" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "used_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "UQ_0309de62e0cb0960ebb2cb65c95" UNIQUE ("token_hash"), CONSTRAINT "PK_8515e60a2cc41584fa4784f52ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_431446f7c168395c2e74a979d7" ON "password_reset"  ("expires_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dni" character varying, "name" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password_hash" character varying NOT NULL, "phone_number" character varying NOT NULL, "address" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "signup_date" TIMESTAMP NOT NULL DEFAULT now(), "email_verified_at" TIMESTAMP, "last_login_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "role_id" integer NOT NULL, "municipality_id" integer NOT NULL, CONSTRAINT "UQ_027941f32603b418d9bf0db0e82" UNIQUE ("dni"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cat_genre" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_2b80ae9400ab2a307e09edb320c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "medical_visit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "visit_date" TIMESTAMP NOT NULL, "diagnosis" character varying(255) NOT NULL, "observations" text NOT NULL, "treatment" text NOT NULL, "next_visit_date" date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "medical_record_id" uuid NOT NULL, "healthcare_worker_id" uuid NOT NULL, CONSTRAINT "PK_8f2626e75e7da0e4c83a72a5bd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "medical_record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "primary_diagnosis" character varying(255) NOT NULL, "medical_history" text NOT NULL, "allergies" text NOT NULL, "blood_type" character varying(10), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "update_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "patient_id" uuid NOT NULL, "created_by" uuid, CONSTRAINT "REL_dddd1dc79ff4c20ae61b62f9ad" UNIQUE ("patient_id"), CONSTRAINT "PK_d96ede886356ac47ddcbb0bf3a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cat_type_indicator" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "measurement_unit" character varying(255) NOT NULL, CONSTRAINT "PK_e9f0c5d1d32fbef1c2a34122550" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "health_indicator" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" numeric(8,2) NOT NULL, "value_secondary" numeric(8,2), "date_hour" TIMESTAMP NOT NULL, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "patient_id" uuid NOT NULL, "type_indicator_id" integer NOT NULL, "registered_by" uuid NOT NULL, CONSTRAINT "PK_877114a5dcbb11a876eac9b7cf4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_088ed16aad822e12aafb10cd47" ON "health_indicator"  ("patient_id", "type_indicator_id", "date_hour") `,
    );
    await queryRunner.query(
      `CREATE TABLE "cat_route_administration" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_f9ffcd314c9a0f384ed2f9ad094" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "medication_schedule_day" ("schedule_id" uuid NOT NULL, "week_day" integer NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_76e5b49e4f088c13a611cf1b3c7" PRIMARY KEY ("schedule_id", "week_day"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cat_notification_state" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_976d7675e0cf67a2a20904f8d0e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "medication_reminder" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date_hour_scheduled" TIMESTAMP NOT NULL, "confirmation_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "schedule_id" uuid NOT NULL, "notification_state_id" integer NOT NULL, CONSTRAINT "PK_36e1a9287e54efb3dee1273e1d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "medication_schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hour" TIME NOT NULL, "times_per_day" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "medicine_id" uuid NOT NULL, CONSTRAINT "PK_fad8438fa0aea3ed46ec3ff27cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "medication" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "drug_name" character varying NOT NULL, "dose" character varying(255) NOT NULL, "instructions" character varying(255), "start_date" date NOT NULL, "end_date" date, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "patient_id" uuid NOT NULL, "route_administration_id" integer NOT NULL, "prescribed_by" uuid, CONSTRAINT "PK_0682f5b7379fea3c2fdb77d6545" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "patient" ("id" uuid NOT NULL, "date_of_birth" date NOT NULL, "emergency_contact_name" character varying NOT NULL, "emergency_contact_phone_number" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "genre_id" integer NOT NULL, "health_center_id" uuid NOT NULL, CONSTRAINT "PK_8dfa510bb29ad31ab2139fbfb99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cat_appointment_state" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_e5152f9f7b22be80641eaf282b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cat_appointment_type" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_ff6ef8d712b88afbd009d13c8e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "appointment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date_hour" TIMESTAMP NOT NULL, "reason" character varying(255) NOT NULL, "duration_minutes" integer, "cancel_reason" character varying(255), "cancelled_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "patient_id" uuid NOT NULL, "healthcare_worker_id" uuid NOT NULL, "appointment_state_id" integer NOT NULL, "appointment_type_id" integer NOT NULL, "created_by" uuid, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ba41dcc72ad336f7b2179aac36" ON "appointment"  ("healthcare_worker_id", "date_hour") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9e19ac6487ead1d425f6a0a49a" ON "appointment"  ("patient_id", "date_hour") `,
    );
    await queryRunner.query(
      `CREATE TABLE "appointment_reminder" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date_hour_send" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "appointment_id" uuid NOT NULL, "notification_state_id" integer NOT NULL, CONSTRAINT "PK_883c442cf89ebd04cb15d72fa99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "clinical_range" ("id" SERIAL NOT NULL, "type_indicator_id" integer NOT NULL, "min_value" numeric(8,2), "max_value" numeric(8,2), "min_value_secondary" numeric(8,2), "max_value_secondary" numeric(8,2), CONSTRAINT "UQ_2fb35861b5601fa4583b85ab74e" UNIQUE ("type_indicator_id"), CONSTRAINT "PK_268ed957a6006635986627adafd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "clinical_range_band" ("id" SERIAL NOT NULL, "clinical_range_id" integer NOT NULL, "sequence" integer NOT NULL, "severity" character varying(16) NOT NULL, "value_kind" character varying(16) NOT NULL DEFAULT 'primary', "min_value" numeric(8,2), "max_value" numeric(8,2), "label" character varying(64) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7b3b91e9028bdc81cddd6e7e671" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e274b2f31373468eae438ab6f2" ON "clinical_range_band"  ("clinical_range_id", "value_kind", "sequence") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_municipality" ADD CONSTRAINT "FK_77da2101df824c80dee1f6aa349" FOREIGN KEY ("department_id") REFERENCES "cat_department"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_caregiver" ADD CONSTRAINT "FK_0724bf6622dbad782bd6a6810d0" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_caregiver" ADD CONSTRAINT "FK_eb9cacde3568f3a06a437a8d4c6" FOREIGN KEY ("caregiver_id") REFERENCES "caregiver"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_caregiver" ADD CONSTRAINT "FK_8579aec5bb3a5de880050b18833" FOREIGN KEY ("relationship_type_id") REFERENCES "cat_relationship_type"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "caregiver" ADD CONSTRAINT "FK_114bf658fe2b416245381f89be0" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "health_center" ADD CONSTRAINT "FK_1518bc9089a22e79a2fb4f1cf0a" FOREIGN KEY ("health_center_type_id") REFERENCES "cat_health_center_type"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "health_center" ADD CONSTRAINT "FK_0dfdf0f1db6da48f8356e6c85af" FOREIGN KEY ("municipality_id") REFERENCES "cat_municipality"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "healthcare_worker" ADD CONSTRAINT "FK_c812183afd1dfcf872c50faf251" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "healthcare_worker" ADD CONSTRAINT "FK_57ed966ff5e501be7c1c9203d68" FOREIGN KEY ("major_id") REFERENCES "cat_major"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "healthcare_worker" ADD CONSTRAINT "FK_d0adad919d288ddb80ec24bd20f" FOREIGN KEY ("health_center_id") REFERENCES "health_center"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset" ADD CONSTRAINT "FK_ad88301fdc79593dd222268a8b6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "cat_role"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_3963c7765b13874e9eeede0eae9" FOREIGN KEY ("municipality_id") REFERENCES "cat_municipality"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_visit" ADD CONSTRAINT "FK_e4f707f4204af8251d2128bd2c3" FOREIGN KEY ("medical_record_id") REFERENCES "medical_record"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_visit" ADD CONSTRAINT "FK_76ebd18589fb790baf19605affe" FOREIGN KEY ("healthcare_worker_id") REFERENCES "healthcare_worker"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_record" ADD CONSTRAINT "FK_dddd1dc79ff4c20ae61b62f9add" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_record" ADD CONSTRAINT "FK_33a389478237982b5ec04cbc4cb" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "health_indicator" ADD CONSTRAINT "FK_c8bed89e389d684a8eec042b5fa" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "health_indicator" ADD CONSTRAINT "FK_3c90a3e2be0f73dcad12eded302" FOREIGN KEY ("type_indicator_id") REFERENCES "cat_type_indicator"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "health_indicator" ADD CONSTRAINT "FK_4788c6bddccab1beee6371f1a8f" FOREIGN KEY ("registered_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medication_schedule_day" ADD CONSTRAINT "FK_d48a5b818fffbd148b2f5978bba" FOREIGN KEY ("schedule_id") REFERENCES "medication_schedule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medication_reminder" ADD CONSTRAINT "FK_0c63995f41ac9f89d53c67bdf98" FOREIGN KEY ("schedule_id") REFERENCES "medication_schedule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medication_reminder" ADD CONSTRAINT "FK_d28ffa2fd18220e9ebb7f47cbf2" FOREIGN KEY ("notification_state_id") REFERENCES "cat_notification_state"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medication_schedule" ADD CONSTRAINT "FK_a734f79e100ce5f66e3d0b5669d" FOREIGN KEY ("medicine_id") REFERENCES "medication"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medication" ADD CONSTRAINT "FK_0609bc001c10e299a4cb11a1d2b" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medication" ADD CONSTRAINT "FK_d4250222a94ad210c9dfc94e542" FOREIGN KEY ("route_administration_id") REFERENCES "cat_route_administration"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medication" ADD CONSTRAINT "FK_14b7d62c6789b16ff59d3ed6765" FOREIGN KEY ("prescribed_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD CONSTRAINT "FK_8dfa510bb29ad31ab2139fbfb99" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD CONSTRAINT "FK_48252ca075bb1341d4d82cf194b" FOREIGN KEY ("genre_id") REFERENCES "cat_genre"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD CONSTRAINT "FK_96154552fab55614efdd6417b41" FOREIGN KEY ("health_center_id") REFERENCES "health_center"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_86b3e35a97e289071b4785a1402" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_70e6311424e44617b924d9834d3" FOREIGN KEY ("healthcare_worker_id") REFERENCES "healthcare_worker"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_8923d6deabf55d9a5cd1f13eaf6" FOREIGN KEY ("appointment_state_id") REFERENCES "cat_appointment_state"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_e4c1d6ea2eca63647be8b9d9622" FOREIGN KEY ("appointment_type_id") REFERENCES "cat_appointment_type"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_97a555b1fd188ab0f8895a0e6e1" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment_reminder" ADD CONSTRAINT "FK_53fa65babfa507e9f56cdc7e72c" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment_reminder" ADD CONSTRAINT "FK_cdfbf5433e271a533c0eeec84a0" FOREIGN KEY ("notification_state_id") REFERENCES "cat_notification_state"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinical_range" ADD CONSTRAINT "FK_2fb35861b5601fa4583b85ab74e" FOREIGN KEY ("type_indicator_id") REFERENCES "cat_type_indicator"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinical_range_band" ADD CONSTRAINT "FK_205fd455c0ea9aa25781c9e16c5" FOREIGN KEY ("clinical_range_id") REFERENCES "clinical_range"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clinical_range_band" DROP CONSTRAINT "FK_205fd455c0ea9aa25781c9e16c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinical_range" DROP CONSTRAINT "FK_2fb35861b5601fa4583b85ab74e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment_reminder" DROP CONSTRAINT "FK_cdfbf5433e271a533c0eeec84a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment_reminder" DROP CONSTRAINT "FK_53fa65babfa507e9f56cdc7e72c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_97a555b1fd188ab0f8895a0e6e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_e4c1d6ea2eca63647be8b9d9622"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_8923d6deabf55d9a5cd1f13eaf6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_70e6311424e44617b924d9834d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_86b3e35a97e289071b4785a1402"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "FK_96154552fab55614efdd6417b41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "FK_48252ca075bb1341d4d82cf194b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "FK_8dfa510bb29ad31ab2139fbfb99"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medication" DROP CONSTRAINT "FK_14b7d62c6789b16ff59d3ed6765"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medication" DROP CONSTRAINT "FK_d4250222a94ad210c9dfc94e542"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medication" DROP CONSTRAINT "FK_0609bc001c10e299a4cb11a1d2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medication_schedule" DROP CONSTRAINT "FK_a734f79e100ce5f66e3d0b5669d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medication_reminder" DROP CONSTRAINT "FK_d28ffa2fd18220e9ebb7f47cbf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medication_reminder" DROP CONSTRAINT "FK_0c63995f41ac9f89d53c67bdf98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medication_schedule_day" DROP CONSTRAINT "FK_d48a5b818fffbd148b2f5978bba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "health_indicator" DROP CONSTRAINT "FK_4788c6bddccab1beee6371f1a8f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "health_indicator" DROP CONSTRAINT "FK_3c90a3e2be0f73dcad12eded302"`,
    );
    await queryRunner.query(
      `ALTER TABLE "health_indicator" DROP CONSTRAINT "FK_c8bed89e389d684a8eec042b5fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_record" DROP CONSTRAINT "FK_33a389478237982b5ec04cbc4cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_record" DROP CONSTRAINT "FK_dddd1dc79ff4c20ae61b62f9add"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_visit" DROP CONSTRAINT "FK_76ebd18589fb790baf19605affe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_visit" DROP CONSTRAINT "FK_e4f707f4204af8251d2128bd2c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_3963c7765b13874e9eeede0eae9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset" DROP CONSTRAINT "FK_ad88301fdc79593dd222268a8b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "healthcare_worker" DROP CONSTRAINT "FK_d0adad919d288ddb80ec24bd20f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "healthcare_worker" DROP CONSTRAINT "FK_57ed966ff5e501be7c1c9203d68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "healthcare_worker" DROP CONSTRAINT "FK_c812183afd1dfcf872c50faf251"`,
    );
    await queryRunner.query(
      `ALTER TABLE "health_center" DROP CONSTRAINT "FK_0dfdf0f1db6da48f8356e6c85af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "health_center" DROP CONSTRAINT "FK_1518bc9089a22e79a2fb4f1cf0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "caregiver" DROP CONSTRAINT "FK_114bf658fe2b416245381f89be0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_caregiver" DROP CONSTRAINT "FK_8579aec5bb3a5de880050b18833"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_caregiver" DROP CONSTRAINT "FK_eb9cacde3568f3a06a437a8d4c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_caregiver" DROP CONSTRAINT "FK_0724bf6622dbad782bd6a6810d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cat_municipality" DROP CONSTRAINT "FK_77da2101df824c80dee1f6aa349"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e274b2f31373468eae438ab6f2"`,
    );
    await queryRunner.query(`DROP TABLE "clinical_range_band"`);
    await queryRunner.query(`DROP TABLE "clinical_range"`);
    await queryRunner.query(`DROP TABLE "appointment_reminder"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9e19ac6487ead1d425f6a0a49a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ba41dcc72ad336f7b2179aac36"`,
    );
    await queryRunner.query(`DROP TABLE "appointment"`);
    await queryRunner.query(`DROP TABLE "cat_appointment_type"`);
    await queryRunner.query(`DROP TABLE "cat_appointment_state"`);
    await queryRunner.query(`DROP TABLE "patient"`);
    await queryRunner.query(`DROP TABLE "medication"`);
    await queryRunner.query(`DROP TABLE "medication_schedule"`);
    await queryRunner.query(`DROP TABLE "medication_reminder"`);
    await queryRunner.query(`DROP TABLE "cat_notification_state"`);
    await queryRunner.query(`DROP TABLE "medication_schedule_day"`);
    await queryRunner.query(`DROP TABLE "cat_route_administration"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_088ed16aad822e12aafb10cd47"`,
    );
    await queryRunner.query(`DROP TABLE "health_indicator"`);
    await queryRunner.query(`DROP TABLE "cat_type_indicator"`);
    await queryRunner.query(`DROP TABLE "medical_record"`);
    await queryRunner.query(`DROP TABLE "medical_visit"`);
    await queryRunner.query(`DROP TABLE "cat_genre"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_431446f7c168395c2e74a979d7"`,
    );
    await queryRunner.query(`DROP TABLE "password_reset"`);
    await queryRunner.query(`DROP TABLE "healthcare_worker"`);
    await queryRunner.query(`DROP TABLE "health_center"`);
    await queryRunner.query(`DROP TABLE "cat_health_center_type"`);
    await queryRunner.query(`DROP TABLE "cat_major"`);
    await queryRunner.query(`DROP TABLE "caregiver"`);
    await queryRunner.query(`DROP TABLE "patient_caregiver"`);
    await queryRunner.query(`DROP TABLE "cat_relationship_type"`);
    await queryRunner.query(`DROP TABLE "cat_municipality"`);
    await queryRunner.query(`DROP TABLE "cat_department"`);
    await queryRunner.query(`DROP TABLE "cat_role"`);
  }
}
