import jwt from "jsonwebtoken";
import { User } from "@src/auth/domain/entities/user";
import { TokenizedData } from "@src/auth/domain/interfaces/tokenizedData";
import { either } from "fp-ts";
import { BuiltinLogger } from "express-zod-api";
import { Either } from "fp-ts/lib/Either";

export class JwtToken {
  private readonly _logger: BuiltinLogger;

  public constructor(
    public readonly user: User,
    logger?: BuiltinLogger,
  ) {
    this._logger =
      logger ??
      new BuiltinLogger({
        level: process.env["NODE_ENV"] === "development" ? "debug" : "info",
        color: true,
      });
  }

  public generate(): string {
    return jwt.sign(
      {
        user: {
          externalId: this.user.externalId,
          fullName: this.user.fullName,
          email: this.user.email,
        },
      },
      process.env["JWT_SECRET"] ?? "no-secret",
      { expiresIn: "12h", algorithm: "HS256", encoding: "utf8" },
    );
  }

  public verify(token: string): Either<Error, TokenizedData> {
    const sanitizedToken = token.startsWith("Bearer")
      ? token.split(" ")[1] ?? token
      : token;

    return either.tryCatch(
      () =>
        jwt.verify(
          sanitizedToken,
          process.env["JWT_SECRET"] ?? "no-secret",
        ) as TokenizedData,
      (anError) => {
        this._logger.error("Failed to verify Token", {
          anError,
        });

        return new Error(String(anError));
      },
    );
  }
}
