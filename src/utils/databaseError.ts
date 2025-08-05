import {
  DATABASE_ERROR,
  DEFAULT_ERROR_STATUS,
} from "@/constants/errors.constant";

export class DatabaseError extends Error {
  status: number;

  constructor(message: string, status: number = DEFAULT_ERROR_STATUS) {
    super(message);
    this.status = status;
    this.name = DATABASE_ERROR;
  }
}
