import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { faker } from "@faker-js/faker";
import { InternetMediaType } from "@src/utils/internetMediaType";
import { createUser } from "../../../auth/test-utils/createUser";
import { createPost } from "../../../auth/test-utils/createPost";

const localRequest = request("http://localhost:3000");

describe("[CMS] Posts", () => {
  describe("POST /cms/posts", () => {
    it("creates a user post", async () => {
      const user = await createUser();

      await createPost(user);
    });

    it("fails to create a user post when user does not exist", async () => {
      const expected = {
        status: "error",
      };
      const externalId = faker.string.uuid();
      const payload = {
        externalId,
        category: faker.word.noun(),
        content: faker.lorem.paragraph(),
      };

      const response = await localRequest
        .post("/cms/posts")
        .send(payload)
        .set("authorization", faker.string.uuid())
        .set("Content-Type", InternetMediaType.ApplicationJson)
        .set("Accept", InternetMediaType.ApplicationJson);

      expect(response.statusCode).toBe(HttpStatusCode.Unauthorized);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject(expected);
    });
  });
});
