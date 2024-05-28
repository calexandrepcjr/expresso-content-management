import request from "supertest";
import app from "@src/app";
import { HttpStatusCode } from "@src/utils/httpStatusCode";

describe("[CMS] Posts", () => {
  describe("GET /cms/posts", () => {
    it("responds with all user posts", async () => {
      const expected = {
        posts: [
          {
            id: 1,
            category: "Nerdy stuff",
            content: "Testing some nerdy stuff",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          {
            id: 2,
            category: "Career",
            content: "A serious blog post regarding career",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
      };

      const response = await request(app).get("/cms/posts");

      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject(expected);
    });
  });
  ("");
  describe("GET /cms/posts/:postId", () => {
    it("responds with a specific user post", async () => {
      const expected = {
        post: {
          id: 1,
          category: "Nerdy stuff",
          content: "Testing some nerdy stuff",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      };

      const response = await request(app).get(`/cms/posts/${expected.post.id}`);

      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject(expected);
    });

    it("fails with an NaN post id", async () => {
      const response = await request(app).get("/cms/posts/theInvalidPostId");

      expect(response.statusCode).toBe(HttpStatusCode.UnprocessableEntity);
    });
  });
});
