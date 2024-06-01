import request from "supertest";
import { HttpStatusCode } from "@src/utils/httpStatusCode";

const localRequest = request("http://localhost:3000");

describe("Content Management System", () => {
  describe("GET /cms", () => {
    it("responds with basic app information", async () => {
      const response = await localRequest.get("/cms");
      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject({
        status: "success",
        data: {
          appName: "expresso-content-management",
          title: "Expresso Content Management",
          content: "A Simple Content Management System",
        },
      });
    });
  });

  describe("GET /cms/health", () => {
    it("responds with the time that the server received the request", async () => {
      const response = await localRequest.get("/cms/health");
      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toMatchObject({
        status: "success",
        data: {
          receivedAt: expect.any(String),
        },
      });
    });
  });
});
