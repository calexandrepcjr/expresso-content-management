import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { faker } from "@faker-js/faker";
import { InternetMediaType } from "@src/utils/internetMediaType";

const localRequest = request("http://localhost:3000");

describe("[Auth] Users", () => {
  describe("POST /auth/users", () => {
    it("creates a user", async () => {
      const expected = {
        status: "created",
        data: {
          createdAt: expect.any(String),
          externalId: expect.any(String),
          token: expect.any(String),
        },
      };
      const payload = {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const response = await localRequest
        .post("/auth/users")
        .send(payload)
        .set("Content-Type", InternetMediaType.ApplicationJson)
        .set("Accept", InternetMediaType.ApplicationJson);

      expect(response.statusCode).toBe(HttpStatusCode.Created);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject(expected);
    });
  });
});
