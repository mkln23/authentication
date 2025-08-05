import type {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
} from "typeorm";
import type { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import { AppDataSource } from "@/configs/database";
import { UPDATE_FAILED, UPSERT_FAILED } from "@/constants/errors.constant";
import { DatabaseError } from "@/utils/databaseError";

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

export const upsertOne = async <Entity extends ObjectLiteral>(
  entity: EntityTarget<Entity>,
  data: DeepPartial<Entity>,
  conflictPaths: Array<keyof Entity & string>,
  transactionManager?: EntityManager,
): Promise<Entity> => {
  const manager = transactionManager ?? AppDataSource.manager;
  const repository = manager.getRepository(entity);

  await repository.upsert(
    [data] as Parameters<typeof repository.upsert>[0],
    conflictPaths,
  );

  const where = conflictPaths.reduce<FindOptionsWhere<Entity>>((acc, key) => {
    if (key in data) {
      return { ...acc, [key]: data[key as keyof typeof data] };
    }
    return acc;
  }, {});

  const saved = await repository.findOneBy(where);
  if (!saved) {
    throw new DatabaseError(UPSERT_FAILED);
  }

  return saved;
};

export const updateOne = async <Entity extends ObjectLiteral>(
  entity: EntityTarget<Entity>,
  criteria: Partial<Entity>, // used to find the row
  data: DeepPartial<Entity>, // fields to update
  transactionManager?: EntityManager,
): Promise<Entity> => {
  const manager = transactionManager ?? AppDataSource.manager;
  const repository = manager.getRepository(entity);

  await repository.update(criteria, data as QueryDeepPartialEntity<Entity>);

  const updated = await repository.findOneBy(criteria);
  if (!updated) {
    throw new DatabaseError(UPDATE_FAILED);
  }

  return updated;
};
