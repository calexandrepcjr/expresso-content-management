import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { Config } from "@src/content-management-system/config/config";
import { InternetMediaType } from "@src/utils/internetMediaType";
import { faker } from "@faker-js/faker";

const localRequest = request("http://localhost:3000");

describe("[CMS] Posts", () => {
  describe("GET /cms/posts/:postId", () => {
    it("responds with a specific user post", async () => {
      const createPayload = {
        category: faker.word.noun(),
        content: faker.lorem.paragraph(),
      };

      const createResponse = await localRequest
        .post(`/cms/${Config.RootUserExternalId}/posts`)
        .send(createPayload)
        .set("Content-Type", InternetMediaType.ApplicationJson)
        .set("Accept", InternetMediaType.ApplicationJson);

      expect(createResponse.statusCode).toBe(HttpStatusCode.Created);
      expect(createResponse.body).toBeInstanceOf(Object);

      const { post } = createResponse.body.data;

      const expectedPost = post;

      const expected = {
        status: "success",
        data: {
          post: {
            id: expectedPost?.id ?? 1,
            category: expectedPost?.category ?? "Nerdy Stuff",
            content: expectedPost?.content ?? "Testing some nerdy stuff",
            author: "Root",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        },
      };

      const response = await localRequest.get(
        `/cms/posts/${expected.data.post.id}`,
      );

      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject(expected);
    });

    it("fails with an NaN post id", async () => {
      const response = await localRequest.get("/cms/posts/theInvalidPostId");

      expect(response.statusCode).toBe(HttpStatusCode.BadRequest);
    });
  });
});
