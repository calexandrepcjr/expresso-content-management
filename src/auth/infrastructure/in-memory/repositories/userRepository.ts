import { UserId } from "@src/auth/domain/interfaces/userId";
import { Config } from "@src/content-management-system/config/config";
import { MutableRequired } from "@src/utils/mutableRequired";
import { either } from "fp-ts";
import { Either } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { BuiltinLogger } from "express-zod-api";
import { UserRepository as DomainUserRepository } from "@src/auth/domain/interfaces/userRepository";
import { randomUUID } from "crypto";
import { User } from "@src/auth/domain/entities/user";

export class UserRepository implements DomainUserRepository {
  private static readonly storage: Map<UserId, User> = new Map<UserId, User>([
    [
      Config.RootUserId,
      new User({
        id: 1,
        fullName: "Root",
        email: "root@root.com",
        externalId: Config.RootUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ],
  ]);
  private static lastId: number = 1;
  private readonly logger: BuiltinLogger;

  public constructor(logger?: BuiltinLogger) {
    // TODO: Move to the outmost layer with DI

    this.logger =
      logger ??
      new BuiltinLogger({
        level: process.env["NODE_ENV"] === "development" ? "debug" : "info",
        color: true,
      });
  }

  public async findAll(): Promise<Either<Error, User[]>> {
    return either.right([...(UserRepository.storage?.values() ?? [])]);
  }

  public async findByExternalId(userId: UserId): Promise<Either<Error, User>> {
    return pipe(
      UserRepository.storage.get(userId),
      either.fromNullable(new Error("User Not Found")),
    );
  }

  public async create(
    userId: UserId,
    aUser: MutableRequired<User>,
  ): Promise<void> {
    const someUsers = UserRepository.storage.get(userId);

    if (!someUsers) {
      UserRepository.lastId = 1;

      const aNewUser = new User({
        ...aUser,
        externalId: randomUUID(),
        id: UserRepository.lastId,
      });
      aUser.id = aNewUser.id;

      UserRepository.storage.set(userId, aNewUser);

      return;
    }

    UserRepository.lastId += 1;

    const aNewUser = new User({
      ...aUser,
      externalId: randomUUID(),
      id: UserRepository.lastId,
    });
    aUser.id = aNewUser.id;

    UserRepository.storage.set(aNewUser.externalId, aNewUser);
  }

  public async update(aUser: User): Promise<void> {
    const aLoadedUser = UserRepository.storage.get(aUser.externalId);

    pipe(
      aLoadedUser,
      either.fromNullable(new Error("User Not Found")),
      either.match(
        (anError) => {
          this.logger.error(anError.message, { post: aUser });

          aUser.invalidate(anError);
        },
        () => {
          const aNewUser = new User({
            ...aUser,
            updatedAt: new Date(),
          });

          UserRepository.storage.set(aUser.externalId, aNewUser);
        },
      ),
    );
  }
  public async removeByExternalId(user: User): Promise<void> {
    pipe(
      UserRepository.storage.get(user.externalId),
      either.fromNullable(new Error("User not Found")),
      either.match(
        (anError) => {
          this.logger.error(anError.message, { user });

          user.invalidate(anError);
        },
        (aLoadedUser) => {
          UserRepository.storage.delete(aLoadedUser.externalId);
        },
      ),
    );
  }
}
