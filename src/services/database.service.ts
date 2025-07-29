import type {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
} from "typeorm";

import { AppDataSource } from "@/configs/database";

export const findOne = async <Entity extends ObjectLiteral>(
  entity: EntityTarget<Entity>,
  options: FindOneOptions<Entity>,
  transactionManager?: EntityManager,
) => {
  const manager = transactionManager ?? AppDataSource.manager;
  return await manager
    .withRepository(AppDataSource.getRepository(entity))
    .findOne(options);
};

export const find = async <Entity extends ObjectLiteral>(
  entity: EntityTarget<Entity>,
  options?: FindManyOptions<Entity>,
  transactionManager?: EntityManager,
) => {
  const manager = transactionManager ?? AppDataSource.manager;
  return await manager
    .withRepository(AppDataSource.getRepository(entity))
    .find(options ?? {});
};

export const insertOne = async <Entity extends ObjectLiteral>(
  entity: EntityTarget<Entity>,
  data: DeepPartial<Entity>,
  transactionManager?: EntityManager,
): Promise<Entity> => {
  const manager = transactionManager ?? AppDataSource.manager;
  const repository = manager.withRepository(
    AppDataSource.getRepository(entity),
  );
  const created = repository.create(data); // creates entity instance
  return await repository.save(created); // inserts into DB
};
