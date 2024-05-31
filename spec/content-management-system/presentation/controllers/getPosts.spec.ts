import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { InternetMediaType } from "@src/utils/internetMediaType";
import { createUser } from "../../../auth/test-utils/createUser";
import { PostResponse } from "@src/content-management-system/presentation/messages/postResponse";

const localRequest = request("http://localhost:3000");

describe("[CMS] Posts", () => {
  describe("[CMS] GET /cms/posts", () => {
    it("responds with all posts", async () => {
      // INFO: Makes sure the test suite health considering the PUT/PATCH calls
      // while we don't have auth to generate fake users bound by test suite executions

      const user = await createUser();

      const allPostsExpected = {
        status: "success",
        data: {
          posts: [
            {
              id: expect.any(Number),
              category: "Nerdy stuff",
              content: "Testing some nerdy stuff",
              author: user.payload.fullName,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            {
              id: expect.any(Number),
              category: "Career",
              content: "A serious blog post regarding career",
              author: user.payload.fullName,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          ],
        },
      };

      for (const post of allPostsExpected.data.posts) {
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

      const allPostsResponse = await localRequest.get("/cms/posts");

      expect(allPostsResponse.statusCode).toBe(HttpStatusCode.OK);
      expect(allPostsResponse.body).toBeInstanceOf(Object);

      const userPostsFromResponse = allPostsResponse.body.data.posts.filter(
        (post: PostResponse) => post.author === user.payload.fullName,
      );

      expect(userPostsFromResponse).toHaveLength(
        allPostsExpected.data.posts.length,
      );
      expect(userPostsFromResponse).toMatchObject(allPostsExpected.data.posts);
    });
  });
});
