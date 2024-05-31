import { faker } from "@faker-js/faker";
import { CreateUserSpec } from "./createUser";
import { localRequest } from "./localRequest";
import { InternetMediaType } from "@src/utils/internetMediaType";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { Post } from "@src/content-management-system/domain/entities/post";

export const createPost = async (
  createUserData: CreateUserSpec,
): Promise<Post> => {
  const user = createUserData;

  const expected = {
    status: "created",
    data: {
      post: {
        id: expect.any(Number),
        category: faker.word.noun(),
        content: faker.lorem.paragraphs(),
        authorId: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    },
  };
  const payload = {
    externalId: user.result.externalId,
    category: expected.data.post.category,
    content: expected.data.post.content,
  };

  const response = await localRequest
    .post("/cms/posts")
    .send(payload)
    .set("authorization", user.result.token)
    .set("Content-Type", InternetMediaType.ApplicationJson)
    .set("Accept", InternetMediaType.ApplicationJson);

  expect(response.statusCode).toBe(HttpStatusCode.Created);
  expect(response.body).toBeInstanceOf(Object);
  expect(response.body).toMatchObject(expected);

  const { post } = response.body.data;

  return post;
};
