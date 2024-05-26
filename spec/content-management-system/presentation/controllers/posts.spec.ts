import request from "supertest";
import app from "@src/app";
import { HttpStatusCode } from "@src/utils/httpStatusCode";

describe("[CMS] Posts", () => {
  describe("GET /cms/posts", () => {
    it("responds with all user posts", async () => {
      const response = await request(app).get("/cms/posts");
      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toBeInstanceOf(Object);
    });
  });
});
