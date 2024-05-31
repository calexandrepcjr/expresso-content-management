import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { faker } from "@faker-js/faker";
import { InternetMediaType } from "@src/utils/internetMediaType";

const localRequest = request("http://localhost:3000");

describe("[Auth] Users", () => {
  describe("POST /auth/users/login", () => {
    it("login as user", async () => {
      const expected = {
        status: "success",
        data: {
          externalId: expect.any(String),
          token: expect.any(String),
        },
      };
      const payload = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const response = await localRequest
        .get("/auth/users/login")
        .send(payload)
        .set("Content-Type", InternetMediaType.ApplicationJson)
        .set("Accept", InternetMediaType.ApplicationJson);

      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject(expected);
    });
  });
});
