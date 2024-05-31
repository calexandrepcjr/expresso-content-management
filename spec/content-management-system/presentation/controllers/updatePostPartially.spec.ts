import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { faker } from "@faker-js/faker";
import { InternetMediaType } from "@src/utils/internetMediaType";
import { createUser } from "../../../auth/test-utils/createUser";
import { createPost } from "../../../auth/test-utils/createPost";

const localRequest = request("http://localhost:3000");

describe("[CMS] Posts", () => {
  describe("PATCH /cms/posts/:postId", () => {
    it("updates a user post partially", async () => {
      const user = await createUser();
      const expectedPost = await createPost(user);

      const payload = {
        category: faker.word.noun(),
        content: undefined,
        externalId: user.result.externalId,
      };
      const expected = {
        status: "success",
        data: {
          post: {
            ...expectedPost,
            category: payload.category,
            updatedAt: expect.any(String),
          },
        },
      };

      const response = await localRequest
        .patch(`/cms/posts/${expectedPost.id}`)
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
            category: payload.category,
            authorId: undefined,
            author: user.payload.fullName,
            updatedAt: expect.any(String),
          },
        },
      });
    });
  });
});
