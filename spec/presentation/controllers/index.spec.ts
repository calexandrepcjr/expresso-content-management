import request from "supertest";
import app from "@src/app";
import { HttpStatusCode } from "@src/utils/httpStatusCode";

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
