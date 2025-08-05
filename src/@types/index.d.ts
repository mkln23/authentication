import type { Users } from "@/database/entities/User.entity";

export {};

declare global {
  namespace Express {
    export interface Request {
      user: Users;
    }
  }
}
