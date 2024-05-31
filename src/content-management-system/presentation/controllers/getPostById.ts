import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostRepository } from "@src/content-management-system/infrastructure/in-memory/repositories/postRepository";
import { pipe } from "fp-ts/lib/function";
import { taskEither } from "fp-ts";
import { z } from "zod";
import createHttpError from "http-errors";
import { taggedEndpointsFactory } from "@src/utils/endpointFactories";
import { ez } from "express-zod-api";
import { PostResponse } from "../postResponse";
import { UserRepository } from "@src/auth/infrastructure/in-memory/repositories/userRepository";

// TODO: Use DI
const postsRepository = new PostRepository();
const usersRepository = new UserRepository();

export const getPostById = taggedEndpointsFactory.build({
  method: "get",
  tag: "posts",
  shortDescription: "Retrieves the post.",
  input: z.object({
    postId: z
      .string()
      .trim()
      .regex(/\d+/)
      .transform((id) => parseInt(id, 10))
      .describe("A numeric string containing the id of the Post"),
  }),
  output: z.object({
    post: z.object({
      id: z.number(),
      category: z.string(),
      content: z.string(),
      author: z.string(),
      createdAt: ez.dateOut(),
      updatedAt: ez.dateOut(),
    }),
  }),
  handler: async ({ input: { postId } }) => {
    const maybePost = await postsRepository.findById(postId);

    return pipe(
      taskEither.fromEither(maybePost),
      taskEither.chain((post) =>
        pipe(
          taskEither.tryCatch(
            () => usersRepository.findById(post.authorId),
            (reason: unknown) => new Error(String(reason)),
          ),
          taskEither.chain(taskEither.fromEither),
          taskEither.map((user) => new PostResponse(post, user)),
        ),
      ),
      taskEither.match(
        (anError) => {
          throw createHttpError(
            HttpStatusCode.InternalServerError,
            anError.message,
          );
        },
        (postResponse) => ({ post: postResponse }),
      ),
    )();
  },
});
