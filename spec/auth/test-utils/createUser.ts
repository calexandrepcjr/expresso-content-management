import { faker } from "@faker-js/faker";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { InternetMediaType } from "@src/utils/internetMediaType";
import { localRequest } from "./localRequest";

export interface CreateUserSpec {
  payload: {
    fullName: string;
    email: string;
    password: string;
  };
  result: {
    createdAt: string;
    externalId: string;
    token: string;
  };
}

export const createUser = async (): Promise<CreateUserSpec> => {
  const expected = {
    status: "created",
    data: {
      createdAt: expect.any(String),
      externalId: expect.any(String),
      token: expect.any(String),
    },
  };
  const payload = {
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const response = await localRequest
    .post("/auth/users/signup")
    .send(payload)
    .set("Content-Type", InternetMediaType.ApplicationJson)
    .set("Accept", InternetMediaType.ApplicationJson);

  expect(response.statusCode).toBe(HttpStatusCode.Created);
  expect(response.body).toBeInstanceOf(Object);
  expect(response.body).toMatchObject(expected);

  return {
    payload,
    result: response.body.data,
  };
};
