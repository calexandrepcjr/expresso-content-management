import { CreateUserSpec } from "./createUser";
import { localRequest } from "./localRequest";
import { InternetMediaType } from "@src/utils/internetMediaType";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostResponse } from "@src/content-management-system/presentation/messages/postResponse";

export const removeAllPosts = async (user: CreateUserSpec): Promise<void> => {
  const expected = {
    status: "success",
    data: {
      deletedAt: expect.any(String),
    },
  };

  const response = await localRequest
    .delete("/cms/posts")
    .send({
      externalId: user.result.externalId,
    })
    .set("authorization", user.result.token)
    .set("Content-Type", InternetMediaType.ApplicationJson)
    .set("Accept", InternetMediaType.ApplicationJson);

  expect(response.statusCode).toBe(HttpStatusCode.OK);
  expect(response.body).toBeInstanceOf(Object);
  expect(response.body).toMatchObject(expected);

  const getAllResponse = await localRequest.get("/cms/posts");

  expect(getAllResponse.statusCode).toBe(HttpStatusCode.OK);
  expect(getAllResponse.body).toBeInstanceOf(Object);

  expect(
    getAllResponse.body.data.posts.filter(
      (post: PostResponse) => post.author === user.payload.fullName,
    ),
  ).toHaveLength(0);
};
