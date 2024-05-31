import { z } from "zod";
import createHttpError from "http-errors";
import { createMiddleware } from "express-zod-api";
import { UserRepository } from "@src/auth/infrastructure/in-memory/repositories/userRepository";
import { pipe } from "fp-ts/lib/function";
import { either } from "fp-ts";
import { JwtToken } from "@src/auth/domain/value-objects/jwtToken";
import { isLeft } from "fp-ts/lib/Either";

// TODO: Use DI instead
const usersRepository = new UserRepository();

export const authorizer = createMiddleware({
  security: {
    and: [
      { type: "input", name: "externalId" },
      { type: "header", name: "authorization" },
    ],
  },
  input: z.object({
    externalId: z.string().min(1),
  }),
  middleware: async ({ input: { externalId }, request, logger }) => {
    logger.debug("Checking the externalId and token");

    const authorizationToken =
      request.headers.authorization ?? request.headers["Authorization"]?.[0];

    const maybeUser = await usersRepository.findByExternalId(externalId);

    return pipe(
      maybeUser,
      either.match(
        (anError) => {
          throw createHttpError.Unauthorized(anError.message);
        },
        (user) => {
          const token = new JwtToken(user);
          const verifiedToken = token.verify(authorizationToken ?? "");

          if (isLeft(verifiedToken)) {
            throw createHttpError.Unauthorized(verifiedToken.left.message);
          }

          return { user };
        },
      ),
    );
  },
});
