import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { faker } from "@faker-js/faker";
import { InternetMediaType } from "@src/utils/internetMediaType";
import { Value } from "@src/auth/domain/value";

const localRequest = request("http://localhost:3000");

describe("[Auth] Users", () => {
  describe("POST /auth/users/login", () => {
    it("login as user", async () => {
      const createExpected = {
        status: "created",
        data: {
          createdAt: expect.any(String),
          externalId: expect.any(String),
          token: expect.any(String),
        },
      };
      const payloadCreate = {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const responseCreate = await localRequest
        .post("/auth/users/signup")
        .send(payloadCreate)
        .set("Content-Type", InternetMediaType.ApplicationJson)
        .set("Accept", InternetMediaType.ApplicationJson);

      expect(responseCreate.statusCode).toBe(HttpStatusCode.Created);
      expect(responseCreate.body).toBeInstanceOf(Object);
      expect(responseCreate.body).toMatchObject(createExpected);

      const { externalId } = responseCreate.body.data;

      const expected = {
        status: "success",
        data: {
          externalId,
          token: expect.any(String),
        },
      };
      const payload = {
        email: payloadCreate.email,
        password: payloadCreate.password,
      };

      const response = await localRequest
        .post("/auth/users/login")
        .send(payload)
        .set("Content-Type", InternetMediaType.ApplicationJson)
        .set("Accept", InternetMediaType.ApplicationJson);

      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject(expected);
      expect(response.body.data.token.length).toBeGreaterThanOrEqual(
        Value.PasswordMaxSize,
      );
    });
  });
});
