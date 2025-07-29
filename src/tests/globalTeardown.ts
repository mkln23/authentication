import "tsconfig-paths/register";

import { AppDataSource } from "@/configs/database";

export default async () => {
  await AppDataSource.dropDatabase();
  await AppDataSource.destroy();
};
