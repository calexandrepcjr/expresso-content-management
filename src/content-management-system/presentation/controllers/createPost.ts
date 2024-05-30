import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostRepository } from "@src/content-management-system/infrastructure/in-memory/repositories/postRepository";
import { z } from "zod";
import createHttpError from "http-errors";
import { statusDependingFactory } from "@src/utils/endpointFactories";
import { Post } from "@src/content-management-system/domain/entities/post";
import { ez } from "express-zod-api";
import { UserRepository } from "@src/auth/infrastructure/in-memory/repositories/userRepository";
import { pipe } from "fp-ts/lib/function";
import { either } from "fp-ts";
import { UserExternalIdSchema } from "@src/auth/domain/entities/userExternalIdSchema";

// TODO: Use DI
const postsRepository = new PostRepository();
const usersRepository = new UserRepository();

export const createPost = statusDependingFactory.build({
  method: "post",
  tag: "posts",
  input: z.object({
    // TODO: Replace by injecting user at runtime when applying Auth
    userId: UserExternalIdSchema,
    category: z.string(),
    content: z.string(),
  }),
  output: z.object({
    post: z.object({
      id: z.number(),
      category: z.string(),
      content: z.string(),
      createdAt: ez.dateOut(),
      updatedAt: ez.dateOut(),
    }),
  }),
  handler: async ({ input: { category, content, userId } }) => {
    const maybeUser = await usersRepository.findByExternalId(userId);

    return pipe(
      maybeUser,
      either.match(
        (anError) => {
          throw createHttpError(HttpStatusCode.InternalServerError, {
            errors: [{ name: "InfrastructureError", message: anError.message }],
          });
        },
        async (user) => {
          const post = Post.new(category, content, user);

          await postsRepository.create(user, post);

          if (!post.isPersisted()) {
            throw createHttpError(HttpStatusCode.InternalServerError, {
              errors: [
                {
                  name: "InfrastructureError",
                  message: "Failed to persist Post",
                },
              ],
            });
          }

          return { post };
        },
      ),
    );
  },
});
