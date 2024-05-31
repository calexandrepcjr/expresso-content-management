import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { faker } from "@faker-js/faker";
import { Config } from "@src/content-management-system/config/config";
import { InternetMediaType } from "@src/utils/internetMediaType";

const localRequest = request("http://localhost:3000");

describe("[CMS] Posts", () => {
  describe("PUT /cms/:userId/posts/:postId", () => {
    it("updates a whole user post", async () => {
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

      const expectedPost = {
        id: post?.id ?? 3,
        category: faker.word.noun(),
        content: faker.lorem.paragraphs(),
        authorId: 1,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      };
      const expected = {
        status: "success",
        data: {
          post: expectedPost,
        },
      };
      const payload = expectedPost;

      const response = await localRequest
        .put(`/cms/${Config.RootUserExternalId}/posts/${expectedPost.id}`)
        .send(payload)
        .set("Content-Type", InternetMediaType.ApplicationJson)
        .set("Accept", InternetMediaType.ApplicationJson);

      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject(expected);

      const getByIdResponse = await localRequest
        .get(`/cms/posts/${expectedPost.id}`)
        .set("Content-Type", InternetMediaType.ApplicationJson)
        .set("Accept", InternetMediaType.ApplicationJson);

      expect(getByIdResponse.statusCode).toBe(HttpStatusCode.OK);
      expect(getByIdResponse.body).toBeInstanceOf(Object);
      expect(getByIdResponse.body).toEqual({
        ...expected,
        data: {
          post: {
            ...expectedPost,
            authorId: undefined,
            author: "Root",
          },
        },
      });
    });
  });
});
