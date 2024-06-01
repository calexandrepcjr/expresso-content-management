import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { createPost } from "@spec/auth/test-utils/createPost";
import { createUser } from "@spec/auth/test-utils/createUser";

const localRequest = request("http://localhost:3000");

describe("[CMS] Posts", () => {
  describe("GET /cms/posts/:postId", () => {
    it("responds with a specific user post", async () => {
      const user = await createUser();
      const post = await createPost(user);

      const expectedPost = post;

      const expected = {
        status: "success",
        data: {
          post: {
            id: expectedPost?.id ?? 1,
            category: expectedPost?.category ?? "Nerdy Stuff",
            content: expectedPost?.content ?? "Testing some nerdy stuff",
            author: user.payload.fullName,
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
