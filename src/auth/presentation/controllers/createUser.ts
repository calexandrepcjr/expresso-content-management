import { z } from "zod";
import createHttpError from "http-errors";
import { statusDependingFactory } from "@src/utils/endpointFactories";
import { ez } from "express-zod-api";
import { UserRepository } from "@src/auth/infrastructure/in-memory/repositories/userRepository";
import { User } from "@src/auth/domain/entities/user";
import { JwtToken } from "@src/auth/domain/value-objects/jwtToken";
import { TokenSchema } from "@src/auth/domain/entities/tokenSchema";
import { Value } from "@src/auth/domain/value";

// TODO: Use DI
const usersRepository = new UserRepository();

export const createUser = statusDependingFactory.build({
  method: "post",
  tag: "auth",
  input: z.object({
    fullName: z.string().min(4),
    // TODO: Add refine with email duplication filter
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid email."),
    password: z.string().min(4).max(Value.PasswordMaxSize),
  }),
  output: z.object({
    createdAt: ez.dateOut(),
    externalId: z.string().uuid(),
    token: TokenSchema,
  }),
  handler: async ({ input: { fullName, email, password } }) => {
    // TODO: Move to Use Case
    const user = User.new({
      fullName,
      email,
      password,
    });
    await usersRepository.create(user);

    if (!user.isValid()) {
      throw createHttpError.InternalServerError(
        user.invalidationReason()?.message ?? "Failed to create user",
      );
    }

    const token = new JwtToken(user);

    return {
      createdAt: user.createdAt,
      externalId: user.externalId,
      token: token.generate(),
    };
  },
});
