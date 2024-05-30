import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostRepository } from "@src/content-management-system/infrastructure/in-memory/repositories/postRepository";
import { pipe } from "fp-ts/lib/function";
import { either } from "fp-ts";
import { z } from "zod";
import createHttpError from "http-errors";
import { taggedEndpointsFactory } from "@src/utils/endpointFactories";
import { ez } from "express-zod-api";

// TODO: Use DI
const postsRepository = new PostRepository();

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
      createdAt: ez.dateOut(),
      updatedAt: ez.dateOut(),
    }),
  }),
  handler: async ({ input: { postId } }) => {
    const maybePost = await postsRepository.findById(postId);

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
        (post) => ({ post }),
      ),
    );
  },
});
