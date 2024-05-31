import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostRepository } from "@src/content-management-system/infrastructure/in-memory/repositories/postRepository";
import { z } from "zod";
import createHttpError from "http-errors";
import { taggedEndpointsFactory } from "@src/utils/endpointFactories";
import { ez } from "express-zod-api";
import { authorizer } from "@src/auth/presentation/middlewares/authorizer";

// TODO: Use DI
const postsRepository = new PostRepository();

export const removeAllUserPosts = taggedEndpointsFactory
  .addMiddleware(authorizer)
  .build({
    method: "delete",
    tag: "posts",
    shortDescription: "Remove all user posts",
    input: z.object({}),
    output: z.object({
      deletedAt: ez.dateOut(),
    }),
    handler: async ({ input: {}, options: { user } }) => {
      //TODO: Apply Use Cases, keep Exceptions at presentation layer
      await postsRepository.removeByUser(user);

      if (!user.isValid()) {
        const anError = user.invalidationReason();

        throw createHttpError(
          HttpStatusCode.InternalServerError,
          anError.message,
        );
      }

      return { deletedAt: new Date() };
    },
  });
