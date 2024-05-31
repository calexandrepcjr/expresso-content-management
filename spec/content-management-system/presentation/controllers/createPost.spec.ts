import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { faker } from "@faker-js/faker";
import { Config } from "@src/content-management-system/config/config";
import { InternetMediaType } from "@src/utils/internetMediaType";

const localRequest = request("http://localhost:3000");

describe("[CMS] Posts", () => {
  describe("POST /cms/:userId/posts", () => {
    it("creates a user post", async () => {
      const expected = {
        status: "created",
        data: {
          post: {
            id: expect.any(Number),
            category: faker.word.noun(),
            content: faker.lorem.paragraphs(),
            authorId: 1,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        },
      };
      const payload = {
        category: expected.data.post.category,
        content: expected.data.post.content,
      };

      const response = await localRequest
        .post(`/cms/${Config.RootUserExternalId}/posts`)
        .send(payload)
        .set("Content-Type", InternetMediaType.ApplicationJson)
        .set("Accept", InternetMediaType.ApplicationJson);

      expect(response.statusCode).toBe(HttpStatusCode.Created);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject(expected);
    });
  });
});
