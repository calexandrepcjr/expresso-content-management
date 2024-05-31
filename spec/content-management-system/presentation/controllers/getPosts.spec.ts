import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { InternetMediaType } from "@src/utils/internetMediaType";
import { Config } from "@src/content-management-system/config/config";

const localRequest = request("http://localhost:3000");

describe("[CMS] Posts", () => {
  describe("[CMS] GET /cms/posts", () => {
    it("responds with all posts", async () => {
      // INFO: Makes sure the test suite health considering the PUT/PATCH calls
      // while we don't have auth to generate fake users bound by test suite executions
      const expected = {
        status: "success",
        data: {
          deletedAt: expect.any(String),
        },
      };

      const response = await localRequest
        .delete(`/cms/${Config.RootUserExternalId}/posts`)
        .set("Content-Type", InternetMediaType.ApplicationJson)
        .set("Accept", InternetMediaType.ApplicationJson);

      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject(expected);

      const allPostsExpected = {
        status: "success",
        data: {
          posts: [
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
          ],
        },
      };

      for (const post of allPostsExpected.data.posts) {
        const payload = {
          category: post.category,
          content: post.content,
        };

        const response = await localRequest
          .post(`/cms/${Config.RootUserExternalId}/posts`)
          .send(payload)
          .set("Content-Type", InternetMediaType.ApplicationJson)
          .set("Accept", InternetMediaType.ApplicationJson);

        expect(response.statusCode).toBe(HttpStatusCode.Created);
        expect(response.body).toBeInstanceOf(Object);
      }

      const allPostsResponse = await localRequest.get("/cms/posts");

      expect(allPostsResponse.statusCode).toBe(HttpStatusCode.OK);
      expect(allPostsResponse.body).toBeInstanceOf(Object);
      expect(allPostsResponse.body).toMatchObject(allPostsExpected);
    });
  });
});
