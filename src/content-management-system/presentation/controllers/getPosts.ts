import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostRepository } from "@src/content-management-system/infrastructure/in-memory/repositories/postRepository";
import { Config } from "@src/content-management-system/config/config";
import { pipe } from "fp-ts/lib/function";
import { either } from "fp-ts";
import { z } from "zod";
import createHttpError from "http-errors";
import { taggedEndpointsFactory } from "@src/utils/endpointFactories";
import { ez } from "express-zod-api";

// TODO: Use DI
const postsRepository = new PostRepository();

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
        createdAt: ez.dateOut(),
        updatedAt: ez.dateOut(),
      }),
    ),
  }),
  handler: async () => {
    //TODO: Apply Use Cases, keep Exceptions at presentation layer
    const maybePosts = await postsRepository.findAll(Config.RootUserId);

    return pipe(
      maybePosts,
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
        (posts) => ({ posts }),
      ),
    );
  },
});
