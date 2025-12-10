import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTable1754375505853 implements MigrationInterface {
    name = 'AddUserTable1754375505853';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."users_status_enum" AS ENUM('created', 'active', 'disabled', 'deleted')`,
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, "mobile" character varying, "password" character varying NOT NULL, "mfaSecret" character varying NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT 'created', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    }
}
