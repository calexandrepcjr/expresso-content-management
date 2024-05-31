import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { faker } from "@faker-js/faker";
import { InternetMediaType } from "@src/utils/internetMediaType";
import { createUser } from "../../../auth/test-utils/createUser";
import { createPost } from "../../../auth/test-utils/createPost";

const localRequest = request("http://localhost:3000");

describe("[CMS] Posts", () => {
  describe("PUT /cms/posts/:postId", () => {
    it("updates a whole user post", async () => {
      const user = await createUser();
      const post = await createPost(user);

      const expectedPost = {
        id: post?.id ?? 3,
        category: faker.word.noun(),
        content: faker.lorem.paragraphs(),
        authorId: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      };
      const expected = {
        status: "success",
        data: {
          post: expectedPost,
        },
      };
      const payload = {
        ...expectedPost,
        externalId: user.result.externalId,
      };

      const response = await localRequest
        .put(`/cms/posts/${expectedPost.id}`)
        .send(payload)
        .set("authorization", user.result.token)
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
            author: user.payload.fullName,
          },
        },
      });
    });
  });
});
