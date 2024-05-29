import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostRepository } from "@src/content-management-system/infrastructure/in-memory/repositories/postRepository";
import { Config } from "@src/content-management-system/config/config";
import { z } from "zod";
import createHttpError from "http-errors";
import { taggedEndpointsFactory } from "@src/utils/endpointFactories";
import { Post } from "@src/content-management-system/domain/entities/post";
import { ez } from "express-zod-api";
import { pipe } from "fp-ts/lib/function";
import { either } from "fp-ts";

// TODO: Use DI
const postsRepository = new PostRepository();

export const updateWholePost = taggedEndpointsFactory.build({
  method: "put",
  tag: "posts",
  shortDescription: "Update whole Post content",
  input: z.object({
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
      createdAt: ez.dateOut(),
      updatedAt: ez.dateOut(),
    }),
  }),
  handler: async ({ input: { postId, category, content }, logger }) => {
    logger.debug("Update Whole Post", {
      postId,
      category,
      content,
    });

    const maybePost = await postsRepository.findById(Config.RootUserId, postId);

    return pipe(
      maybePost,
      either.match(
        (anError) => {
          throw createHttpError(HttpStatusCode.InternalServerError, {
            errors: [
              {
                name: anError.name,
                message: anError.message,
              },
            ],
          });
        },
        async (post) => {
          const aNewPost = new Post({
            id: postId,
            category,
            content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
          });

          await postsRepository.update(Config.RootUserId, aNewPost);

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
      ),
    );
  },
});
