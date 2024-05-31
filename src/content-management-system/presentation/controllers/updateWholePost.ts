import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostRepository } from "@src/content-management-system/infrastructure/in-memory/repositories/postRepository";
import { z } from "zod";
import createHttpError from "http-errors";
import { taggedEndpointsFactory } from "@src/utils/endpointFactories";
import { Post } from "@src/content-management-system/domain/entities/post";
import { ez } from "express-zod-api";
import { pipe } from "fp-ts/lib/function";
import { taskEither } from "fp-ts";
import { UserRepository } from "@src/auth/infrastructure/in-memory/repositories/userRepository";
import { TaskEither } from "fp-ts/lib/TaskEither";
import { User } from "@src/auth/domain/entities/user";
import { UserExternalIdSchema } from "@src/auth/domain/entities/userExternalIdSchema";

// TODO: Use DI
const postsRepository = new PostRepository();
const usersRepository = new UserRepository();

export const updateWholePost = taggedEndpointsFactory.build({
  method: "put",
  tag: "posts",
  shortDescription: "Update whole Post content",
  input: z.object({
    // TODO: Replace by injecting user at runtime when applying Auth
    userId: UserExternalIdSchema,
    postId: z
      .string()
      .trim()
      .regex(/\d+/)
      .transform((id) => parseInt(id, 10))
      .describe("A numeric string containing the id of the Post"),
    category: z.string(),
    content: z.string(),
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
  handler: async ({ input: { userId, postId, category, content }, logger }) => {
    logger.debug("Update Whole Post", {
      postId,
      category,
      content,
    });

    // TODO: Send to Use Case
    const maybeUser = await usersRepository.findByExternalId(userId);

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
            category,
            content,
            authorId: user.id,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
          });

          await postsRepository.update(user.externalId, aNewPost);

          if (!aNewPost.isValid()) {
            const reason = aNewPost.invalidationReason();
            throw createHttpError(HttpStatusCode.InternalServerError, {
              errors: [
                {
                  name: reason.name,
                  message: reason.message,
                },
              ],
            });
          }

          return { post: aNewPost };
        },
        (reason: unknown) => new Error(String(reason)),
      );
    const failureFlow = (anError: Error) => {
      throw createHttpError(HttpStatusCode.InternalServerError, {
        errors: [
          {
            name: anError.name,
            message: anError.message,
          },
        ],
      });
    };

    return pipe(
      taskEither.fromEither(maybeUser),
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
