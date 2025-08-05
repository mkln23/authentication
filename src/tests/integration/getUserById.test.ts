import httpStatus from "http-status";
import request from "supertest";

import { AppDataSource } from "@/configs/database";
import { ApiRoutes } from "@/constants/apiRoutes.constant";
import {
  userDoesNotExistWithGivenKey,
  validationError,
} from "@/constants/errors.constant";
import { USERID } from "@/schema/pathParam.schema";
import app from "@/server";

import { UserFactory } from "../factories/user.factory";

const GET_USER_BY_ID = `${ApiRoutes.API_BASE}${ApiRoutes.AUTH}${ApiRoutes.USERS}${ApiRoutes.USERID}`;

describe("GET User by ID", () => {
  const sendRequest = async (userId: number) => {
    return await request(app).get(
      GET_USER_BY_ID.replace(":userId", userId.toString()),
    );
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Successful Retrieval", () => {
    it("should return give response with proper body", async () => {
      const user = await new UserFactory(AppDataSource).create();
      const response = await sendRequest(user.id);

      expect(response.status).toBe(httpStatus.FOUND);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("id", user.id);
      expect(response.body.user).toHaveProperty("email");
      expect(response.body.user).toHaveProperty("name");
      expect(response.body.user).toHaveProperty("mobile");
      expect(response.body.user).toHaveProperty("createdAt");
      expect(response.body.user).toHaveProperty("updatedAt");
      expect(response.body.user).toHaveProperty("deletedAt");
      expect(response.body.user.deletedAt).toBe(null);
    });

    it("should return error if no user exist with the requested userId", async () => {
      const user = await new UserFactory(AppDataSource).create();
      const response = await sendRequest(user.id + 1);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe(userDoesNotExistWithGivenKey(USERID));
    });

    it("should return error if request without userId is requested", async () => {
      const response = await request(app).get(
        GET_USER_BY_ID.replace(":userId", "hello"),
      );

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe(
        validationError.keyMustBeValidNumber(USERID),
      );
    });
  });
});
