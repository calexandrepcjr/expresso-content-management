import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { InternetMediaType } from "@src/utils/internetMediaType";
import { faker } from "@faker-js/faker";
import { Config } from "@src/content-management-system/config/config";

const localRequest = request("http://localhost:3000");

describe("[CMS] Posts", () => {
  describe("GET /cms/posts", () => {
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
  describe("GET /cms/posts/:postId", () => {
    it("responds with a specific user post", async () => {
      const allPostsResponse = await localRequest.get("/cms/posts");

      expect(allPostsResponse.statusCode).toBe(HttpStatusCode.OK);
      expect(allPostsResponse.body).toBeInstanceOf(Object);

      const expectedPost = allPostsResponse.body.data.posts.pop();

      const expected = {
        status: "success",
        data: {
          post: {
            id: expectedPost.id ?? 1,
            category: expectedPost?.category ?? "Nerdy Stuff",
            content: expectedPost?.content ?? "Testing some nerdy stuff",
            author: "Root",
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
  describe("POST /cms/:userId/posts", () => {
    it("creates a user post", async () => {
      const expected = {
        status: "created",
        data: {
          post: {
            id: expect.any(Number),
            category: faker.word.noun(),
            content: faker.lorem.paragraphs(),
            authorId: 1,
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
        .post(`/cms/${Config.RootUserExternalId}/posts`)
        .send(payload)
        .set("Content-Type", InternetMediaType.ApplicationJson)
        .set("Accept", InternetMediaType.ApplicationJson);

      expect(response.statusCode).toBe(HttpStatusCode.Created);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject(expected);
    });
  });
  describe("PUT /cms/:userId/posts/:postId", () => {
    it("updates a whole user post", async () => {
      const allPostsResponse = await localRequest.get("/cms/posts");

      expect(allPostsResponse.statusCode).toBe(HttpStatusCode.OK);
      expect(allPostsResponse.body).toBeInstanceOf(Object);

      const post = allPostsResponse.body.data.posts.pop();

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
    describe("DELETE /cms/:userId/posts", () => {
      it("removes all user posts", async () => {
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

        const getAllExpected = {
          status: "success",
          data: {
            posts: [],
          },
        };

        const getAllResponse = await localRequest.get("/cms/posts");

        expect(getAllResponse.statusCode).toBe(HttpStatusCode.OK);
        expect(getAllResponse.body).toBeInstanceOf(Object);
        expect(getAllResponse.body).toMatchObject(getAllExpected);
      });
    });
  });
});
