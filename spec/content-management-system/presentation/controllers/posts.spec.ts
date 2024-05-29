import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { InternetMediaType } from "@src/utils/internetMediaType";
import { faker } from "@faker-js/faker";

const localRequest = request("http://localhost:3000");

describe("[CMS] Posts", () => {
  describe("GET /cms/posts", () => {
    it("responds with all user posts", async () => {
      const expected = {
        status: "success",
        data: {
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
        },
      };

      const response = await localRequest.get("/cms/posts");

      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject(expected);
    });
  });
  describe("GET /cms/posts/:postId", () => {
    it("responds with a specific user post", async () => {
      const expected = {
        status: "success",
        data: {
          post: {
            id: 1,
            category: "Nerdy stuff",
            content: "Testing some nerdy stuff",
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
  describe("POST /cms/posts", () => {
    it("creates a user post", async () => {
      const expected = {
        status: "created",
        data: {
          post: {
            id: expect.any(Number),
            category: faker.word.noun(),
            content: faker.lorem.paragraphs(),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        },
      };
      const payload = {
        category: expected.data.post.category,
        content: expected.data.post.content,
      };

      const response = await localRequest
        .post("/cms/posts")
        .send(payload)
        .set("Content-Type", InternetMediaType.ApplicationJson)
        .set("Accept", InternetMediaType.ApplicationJson);

      expect(response.statusCode).toBe(HttpStatusCode.Created);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject(expected);
    });
  });
  describe("PUT /cms/posts/:postId", () => {
    it("updates a whole user post", async () => {
      const expectedPost = {
        id: 3,
        category: faker.word.noun(),
        content: faker.lorem.paragraphs(),
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
        .put(`/cms/posts/${expectedPost.id}`)
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
      expect(getByIdResponse.body).toMatchObject(expected);
    });
  });
});
