import { Config } from "@src/content-management-system/config/config";
import { MutableRequired } from "@src/utils/mutableRequired";
import { either } from "fp-ts";
import { Either } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { BuiltinLogger } from "express-zod-api";
import { UserRepository as DomainUserRepository } from "@src/auth/domain/interfaces/userRepository";
import { randomUUID } from "crypto";
import { User } from "@src/auth/domain/entities/user";
import { UserExternalId } from "@src/auth/domain/interfaces/userExternalId";

export class UserRepository implements DomainUserRepository {
  private static readonly storage: Map<UserExternalId, User> = new Map<
    UserExternalId,
    User
  >([
    [
      Config.RootUserExternalId,
      new User({
        id: 1,
        fullName: "Root",
        email: "root@root.com",
        externalId: Config.RootUserExternalId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ],
  ]);
  private static readonly storageIndexById: Map<number, UserExternalId> =
    new Map<number, UserExternalId>([[1, Config.RootUserExternalId]]);
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

  public async findByExternalId(
    userExternalId: UserExternalId,
  ): Promise<Either<Error, User>> {
    return pipe(
      UserRepository.storage.get(userExternalId),
      either.fromNullable(new Error("User Not Found")),
    );
  }

  public async create(
    userId: UserExternalId,
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
    UserRepository.storageIndexById.set(aNewUser.id, aNewUser.externalId);
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
          UserRepository.storageIndexById.delete(aLoadedUser.id);
        },
      ),
    );
  }

  public async findById(userId: number): Promise<Either<Error, User>> {
    return pipe(
      UserRepository.storage.get(
        UserRepository.storageIndexById.get(userId) ?? "",
      ),
      either.fromNullable(new Error("User not Found")),
    );
  }

  public async findGroupByIds(
    ids: number[],
  ): Promise<Either<Error, Map<number, User>>> {
    const groupByIds = new Map<number, User>();

    for (const id of ids) {
      groupByIds.set(
        id,
        UserRepository.storage.get(
          UserRepository.storageIndexById.get(id) ?? "",
        ) ?? User.empty(),
      );
    }

    return either.right(groupByIds);
  }
}
