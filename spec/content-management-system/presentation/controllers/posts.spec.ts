import request from "supertest";
import app from "@src/app";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { InternetMediaType } from "@src/utils/internetMediaType";
import { faker } from "@faker-js/faker";

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
  describe("POST /cms/posts", () => {
    it("creates a user post", async () => {
      const expected = {
        post: {
          id: 3,
          category: faker.word.noun(),
          content: faker.lorem.paragraphs(),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      };
      const payload = {
        category: expected.post.category,
        content: expected.post.content,
      };

      const response = await request(app)
        .post("/cms/posts")
        .send(payload)
        .set("Content-Type", InternetMediaType.ApplicationJson)
        .set("Accept", InternetMediaType.ApplicationJson);

      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject(expected);
    });
  });
});
