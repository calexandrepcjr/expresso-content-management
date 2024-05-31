import { z } from "zod";
import createHttpError from "http-errors";
import { taggedEndpointsFactory } from "@src/utils/endpointFactories";
import { UserRepository } from "@src/auth/infrastructure/in-memory/repositories/userRepository";
import { JwtToken } from "@src/auth/domain/value-objects/jwtToken";
import { pipe } from "fp-ts/lib/function";
import { taskEither } from "fp-ts";
import { User } from "@src/auth/domain/entities/user";
import { TaskEither } from "fp-ts/lib/TaskEither";
import { TokenSchema } from "@src/auth/domain/entities/tokenSchema";
import { Value } from "@src/auth/domain/value";

// TODO: Use DI
const usersRepository = new UserRepository();

export const loginUser = taggedEndpointsFactory.build({
  method: "post",
  tag: "auth",
  input: z.object({
    // TODO: Add refine with email duplication filter
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid email."),
    password: z.string().min(4).max(Value.PasswordMaxSize),
  }),
  output: z.object({
    externalId: z.string().uuid(),
    token: TokenSchema,
  }),
  handler: async ({ input: { email, password } }) => {
    // TODO: Move to Use Case
    const maybeUser = await usersRepository.findByEmail(email);

    const isValidPassword = (user: User): TaskEither<Error, boolean> => {
      return pipe(
        taskEither.tryCatch(
          () => user.password.check(password),
          (reason) => new Error(String(reason)),
        ),
      );
    };

    return pipe(
      maybeUser,
      taskEither.fromEither,
      taskEither.flatMap((user) =>
        pipe(
          isValidPassword(user),
          taskEither.flatMap((isValid) => {
            if (!isValid) {
              return taskEither.left(new Error("Invalid password"));
            }

            return taskEither.right(user);
          }),
        ),
      ),
      taskEither.match(
        (anError) => {
          throw createHttpError.Unauthorized(anError.message);
        },
        (user) => {
          const token = new JwtToken(user);

          return { externalId: user.externalId, token: token.generate() };
        },
      ),
    )();
  },
});
