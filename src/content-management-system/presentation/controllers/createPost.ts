import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostRepository } from "@src/content-management-system/infrastructure/in-memory/repositories/postRepository";
import { z } from "zod";
import createHttpError from "http-errors";
import { statusDependingFactory } from "@src/utils/endpointFactories";
import { Post } from "@src/content-management-system/domain/entities/post";
import { ez } from "express-zod-api";
import { authorizer } from "@src/auth/presentation/middlewares/authorizer";

// TODO: Use DI
const postsRepository = new PostRepository();

export const createPost = statusDependingFactory
  .addMiddleware(authorizer)
  .build({
    method: "post",
    tag: "posts",
    shortDescription: "Creates a User Post.",
    input: z.object({
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
    handler: async ({ input: { category, content }, options: { user } }) => {
      const post = Post.new(category, content, user);

      await postsRepository.create(user, post);

      if (!post.isPersisted()) {
        throw createHttpError(
          HttpStatusCode.InternalServerError,
          "Failed to persist Post",
        );
      }

      return { post };
    },
  });
