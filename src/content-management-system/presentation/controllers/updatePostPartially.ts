import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostRepository } from "@src/content-management-system/infrastructure/in-memory/repositories/postRepository";
import { z } from "zod";
import createHttpError from "http-errors";
import { taggedEndpointsFactory } from "@src/utils/endpointFactories";
import { Post } from "@src/content-management-system/domain/entities/post";
import { ez } from "express-zod-api";
import { pipe } from "fp-ts/lib/function";
import { taskEither } from "fp-ts";
import { TaskEither } from "fp-ts/lib/TaskEither";
import { User } from "@src/auth/domain/entities/user";
import { authorizer } from "@src/auth/presentation/middlewares/authorizer";

// TODO: Use DI
const postsRepository = new PostRepository();

export const updatePostPartially = taggedEndpointsFactory
  .addMiddleware(authorizer)
  .build({
    method: "patch",
    tag: "posts",
    shortDescription: "Update partially Post content",
    input: z.object({
      postId: z
        .string()
        .trim()
        .regex(/\d+/)
        .transform((id) => parseInt(id, 10))
        .describe("A numeric string containing the id of the Post"),
      category: z.string().nullish(),
      content: z.string().nullish(),
    }),
    output: z.object({
      post: z.object({
        id: z.number(),
        category: z.string(),
        content: z.string(),
        authorId: z.number(),
        createdAt: ez.dateOut(),
        updatedAt: ez.dateOut(),
      }),
    }),
    handler: async ({
      input: { postId, category, content },
      options: { user },
    }) => {
      // TODO: Send to Use Case

      const findUserPost = (postId: number): TaskEither<Error, Post> =>
        pipe(
          taskEither.tryCatch(
            () => postsRepository.findById(postId),
            (reason: unknown) => new Error(String(reason)),
          ),
          taskEither.chain(taskEither.fromEither),
        );
      const updatePost = (
        user: User,
        post: Post,
      ): TaskEither<Error, { post: Post }> =>
        taskEither.tryCatch(
          async () => {
            const aNewPost = new Post({
              id: postId,
              category: category ?? post.category,
              content: content ?? post.content,
              authorId: user.id,
              createdAt: post.createdAt,
              updatedAt: new Date(),
            });

            await postsRepository.update(user, aNewPost);

            if (!aNewPost.isValid()) {
              const reason = aNewPost.invalidationReason();
              throw createHttpError(
                HttpStatusCode.InternalServerError,
                reason.message,
              );
            }

            return { post: aNewPost };
          },
          (reason: unknown) => new Error(String(reason)),
        );
      const failureFlow = (anError: Error) => {
        throw createHttpError(
          HttpStatusCode.InternalServerError,
          anError.message,
        );
      };

      return pipe(
        taskEither.of(user),
        taskEither.chain((user) =>
          pipe(
            findUserPost(postId),
            taskEither.chain((post) => updatePost(user, post)),
          ),
        ),
        taskEither.match(failureFlow, (response) => response),
      )();
    },
  });
