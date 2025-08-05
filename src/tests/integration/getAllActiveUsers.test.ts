import httpStatus from "http-status";
import request from "supertest";

import { AppDataSource } from "@/configs/database";
import { ApiRoutes } from "@/constants/apiRoutes.constant";
import { NO_USER_EXIST } from "@/constants/errors.constant";
import type { Users } from "@/database/entities/User.entity";
import app from "@/server";

import { UserFactory } from "../factories/user.factory";

const GET_ACTIVE_USERS = `${ApiRoutes.API_BASE}${ApiRoutes.AUTH}${ApiRoutes.USERS}`;

describe("GET all active Users", () => {
  const sendRequest = async () => {
    return await request(app).get(GET_ACTIVE_USERS);
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Successful Retrieval", () => {
    it("should return give response with proper body", async () => {
      await new UserFactory(AppDataSource).createMany(5);
      const response = await sendRequest();

      expect(response.status).toBe(httpStatus.FOUND);
      expect(response.body).toHaveProperty("users");
      expect(response.body.users).toBeInstanceOf(Array);
      expect(response.body.users.length).toBe(5);
      response.body.users.forEach((user: Users) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("email");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("mobile");
        expect(user).toHaveProperty("createdAt");
        expect(user).toHaveProperty("updatedAt");
        expect(user).toHaveProperty("deletedAt");
        expect(user.deletedAt).toBe(null);
        expect(user).toHaveProperty("mfaSecret");
        expect(user.mfaSecret).not.toBe(null);
        expect(user).not.toHaveProperty("password");
      });
    });

    it("should return error if no user exist", async () => {
      const response = await sendRequest();

      expect(response.status).toBe(httpStatus.NOT_FOUND);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe(NO_USER_EXIST);
    });

    it("should not return the deleted user", async () => {
      await new UserFactory(AppDataSource).createMany(3, {
        deletedAt: new Date(),
      });
      await new UserFactory(AppDataSource).createMany(5);
      const response = await sendRequest();

      expect(response.body.users.length).toBe(5);
    });
  });
});
