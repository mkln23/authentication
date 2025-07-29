import type { EntityManager, QueryRunner } from "typeorm";

import { AppDataSource } from "@/configs/database";

let queryRunner: QueryRunner;
let originalManager: EntityManager;

beforeAll(async () => {
  await AppDataSource.initialize();

  queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  await queryRunner.startTransaction();
  originalManager = AppDataSource.manager;
  Object.defineProperty(AppDataSource, "manager", {
    get: () => queryRunner.manager,
    configurable: true,
  });
});

afterEach(async () => {
  await queryRunner.rollbackTransaction();
  await queryRunner.startTransaction();
});

afterAll(async () => {
  Object.defineProperty(AppDataSource, "manager", {
    value: originalManager,
    configurable: true,
  });
  await queryRunner.release();
  await AppDataSource.destroy();
});
