import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostRepository } from "@src/content-management-system/infrastructure/in-memory/repositories/postRepository";
import { Config } from "@src/content-management-system/config/config";
import { z } from "zod";
import createHttpError from "http-errors";
import { statusDependingFactory } from "@src/utils/endpointFactories";
import { Post } from "@src/content-management-system/domain/entities/post";
import { ez } from "express-zod-api";

// TODO: Use DI
const postsRepository = new PostRepository();

export const createPost = statusDependingFactory.build({
  method: "post",
  tag: "posts",
  input: z.object({
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
  handler: async ({ input: { category, content } }) => {
    const post = Post.new(category, content);

    await postsRepository.create(Config.RootUserId, post);

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
});
