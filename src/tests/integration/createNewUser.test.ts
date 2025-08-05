import httpStatus from "http-status";
import request from "supertest";

import { ApiRoutes } from "@/constants/apiRoutes.constant";
import { userAlreadyExist } from "@/constants/errors.constant";
import { UserStatus } from "@/enums/userStatus.enums";
import type { CreateUserBodyType } from "@/schema/reqBody.schema";
import app from "@/server";
import { MailService } from "@/services/mail.service";

const CREATE_NEW_USER = `${ApiRoutes.API_BASE}${ApiRoutes.AUTH}${ApiRoutes.USERS}`;

describe("POST New User", () => {
  const sendRequest = async (userBody: CreateUserBodyType) => {
    return await request(app).post(CREATE_NEW_USER).send(userBody);
  };

  beforeEach(() => {
    jest.spyOn(MailService, "sendMail").mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Successful Retrieval", () => {
    it("should create a new user return the response with proper body", async () => {
      const userbody: CreateUserBodyType = {
        name: "Test User",
        email: "test@email.com",
        mobile: "1234567890",
        password: "password123",
      };
      const response = await sendRequest(userbody);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user).toHaveProperty("email", userbody.email);
      expect(response.body.user).toHaveProperty("name", userbody.name);
      expect(response.body.user).toHaveProperty("mobile", userbody.mobile);
      expect(response.body.user).toHaveProperty("createdAt");
      expect(response.body.user).toHaveProperty("updatedAt");
      expect(response.body.user).toHaveProperty("deletedAt");
      expect(response.body.user.deletedAt).toBe(null);
      expect(response.body.user).toHaveProperty("mfaSecret");
      expect(response.body.user.mfaSecret).not.toBe(null);
      expect(response.body.user).toHaveProperty("status");
      expect(response.body.user.status).toBe(UserStatus.CREATED);
    });

    it("should throw error when tried to create a new user with existing email", async () => {
      const userbody: CreateUserBodyType = {
        name: "Test User",
        email: "test@email.com",
        mobile: "1234567890",
        password: "password123",
      };
      await sendRequest(userbody);
      const duplicateUserbody: CreateUserBodyType = {
        name: "Test User Duplicate",
        email: "test@email.com",
        mobile: "1234567890",
        password: "password123",
      };
      const response = await sendRequest(duplicateUserbody);

      expect(response.status).toBe(httpStatus.CONFLICT);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe(
        userAlreadyExist(duplicateUserbody.email),
      );
    });
  });
});
