import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { InternetMediaType } from "@src/utils/internetMediaType";
import {
  CreateUserSpec,
  createUser,
} from "../../../auth/test-utils/createUser";
import { createPost } from "../../../auth/test-utils/createPost";
import { removeAllPosts } from "../../../auth/test-utils/removeAllPosts";

const localRequest = request("http://localhost:3000");

describe("[CMS] Posts", () => {
  describe("DELETE /cms/posts", () => {
    let user: CreateUserSpec;

    beforeAll(async () => {
      user = await createUser();

      await createPost(user);
    });

    afterAll(async () => {
      const posts = [
        {
          id: expect.any(Number),
          category: "Nerdy stuff",
          content: "Testing some nerdy stuff",
          author: "Root",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: expect.any(Number),
          category: "Career",
          content: "A serious blog post regarding career",
          author: "Root",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ];

      for (const post of posts) {
        const payload = {
          externalId: user.result.externalId,
          category: post.category,
          content: post.content,
        };

        const response = await localRequest
          .post("/cms/posts")
          .send(payload)
          .set("authorization", user.result.token)
          .set("Content-Type", InternetMediaType.ApplicationJson)
          .set("Accept", InternetMediaType.ApplicationJson);

        expect(response.statusCode).toBe(HttpStatusCode.Created);
        expect(response.body).toBeInstanceOf(Object);
      }
    });

    it("removes all user posts", async () => {
      await removeAllPosts(user);
    });
  });
});
