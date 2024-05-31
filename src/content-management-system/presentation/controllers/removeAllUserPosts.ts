import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostRepository } from "@src/content-management-system/infrastructure/in-memory/repositories/postRepository";
import { pipe } from "fp-ts/lib/function";
import { either } from "fp-ts";
import { z } from "zod";
import createHttpError from "http-errors";
import { taggedEndpointsFactory } from "@src/utils/endpointFactories";
import { ez } from "express-zod-api";
import { UserRepository } from "@src/auth/infrastructure/in-memory/repositories/userRepository";
import { UserExternalIdSchema } from "@src/auth/domain/entities/userExternalIdSchema";

// TODO: Use DI
const postsRepository = new PostRepository();
const usersRepository = new UserRepository();

// WARN: Implementing Auth is very important on this part considering that
// only the Posts author should be able to delete all the Posts
export const removeAllUserPosts = taggedEndpointsFactory.build({
  method: "delete",
  tag: "posts",
  shortDescription: "Remove all user posts",
  input: z.object({
    // TODO: Replace by injecting user at runtime when applying Auth
    userId: UserExternalIdSchema,
  }),
  output: z.object({
    deletedAt: ez.dateOut(),
  }),
  handler: async ({ input: { userId } }) => {
    //TODO: Apply Use Cases, keep Exceptions at presentation layer

    const maybeUser = await usersRepository.findByExternalId(userId);

    return pipe(
      maybeUser,
      either.match(
        (anError) => {
          throw createHttpError(
            HttpStatusCode.InternalServerError,
            anError.message,
          );
        },
        async (user) => {
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
      ),
    );
  },
});
