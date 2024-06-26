import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostRepository } from "@src/content-management-system/infrastructure/in-memory/repositories/postRepository";
import { pipe } from "fp-ts/lib/function";
import { taskEither } from "fp-ts";
import { z } from "zod";
import createHttpError from "http-errors";
import { taggedEndpointsFactory } from "@src/utils/endpointFactories";
import { ez } from "express-zod-api";
import { PostResponse } from "@src/content-management-system/presentation/messages/postResponse";
import { UserRepository } from "@src/auth/infrastructure/in-memory/repositories/userRepository";
import { User } from "@src/auth/domain/entities/user";

// TODO: Use DI
const postsRepository = new PostRepository();
const usersRepository = new UserRepository();

export const getPosts = taggedEndpointsFactory.build({
  method: "get",
  tag: "posts",
  shortDescription: "Get all posts",
  input: z.object({}),
  output: z.object({
    posts: z.array(
      z.object({
        id: z.number(),
        category: z.string(),
        content: z.string(),
        author: z.string(),
        createdAt: ez.dateOut(),
        updatedAt: ez.dateOut(),
      }),
    ),
  }),
  handler: async () => {
    //TODO: Apply Use Cases, keep Exceptions at presentation layer
    const maybePosts = await postsRepository.findAll();

    return pipe(
      taskEither.fromEither(maybePosts),
      taskEither.chain((posts) =>
        pipe(
          taskEither.tryCatch(
            () =>
              usersRepository.findGroupByIds(
                posts.map((post) => post.authorId),
              ),
            (reason: unknown) => new Error(String(reason)),
          ),
          taskEither.chain(taskEither.fromEither),
          taskEither.map((groupedUsers) =>
            posts.map(
              (post) =>
                new PostResponse(
                  post,
                  groupedUsers.get(post.authorId) ?? User.empty(),
                ),
            ),
          ),
        ),
      ),
      taskEither.match(
        (anError) => {
          throw createHttpError(
            HttpStatusCode.InternalServerError,
            anError.message,
          );
        },
        (postResponses) => ({ posts: postResponses }),
      ),
    )();
  },
});
