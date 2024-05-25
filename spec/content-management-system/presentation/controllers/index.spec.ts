import request from "supertest";
import app from "@src/app";
import { HttpStatusCode } from "@src/utils/httpStatusCode";

describe("Content Management System", () => {
  describe("GET /", () => {
    it("responds with basic app information", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject({
        appName: "expresso-content-management",
        title: "Expresso Content Management",
        content: "A Simple Content Management System",
      });
    });
  });

  describe("GET /health", () => {
    it("responds with the time that the server received the request", async () => {
      const response = await request(app).get("/health");
      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject({
        receivedAt: expect.any(String),
      });
    });
  });
});
