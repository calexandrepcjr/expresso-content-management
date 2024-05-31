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
import { Password } from "@src/auth/domain/value-objects/password";

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
        password: new Password(process.env["ROOT_PASSWORD"] ?? "1234"),
        externalId: Config.RootUserExternalId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ],
  ]);
  private static readonly storageIndexById: Map<number, UserExternalId> =
    new Map<number, UserExternalId>([[1, Config.RootUserExternalId]]);
  private static readonly storageIndexByEmail: Map<string, UserExternalId> =
    new Map<string, UserExternalId>([
      ["root@root.com", Config.RootUserExternalId],
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

  public async findByExternalId(
    userExternalId: UserExternalId,
  ): Promise<Either<Error, User>> {
    return pipe(
      UserRepository.storage.get(userExternalId),
      either.fromNullable(new Error("User Not Found")),
    );
  }

  public async findByEmail(email: string): Promise<Either<Error, User>> {
    return pipe(
      UserRepository.storage.get(
        UserRepository.storageIndexByEmail.get(email) ?? "",
      ),
      either.fromNullable(new Error("User Not Found")),
    );
  }

  public async create(aUser: MutableRequired<User>): Promise<void> {
    const someUsers = UserRepository.storage.get(aUser.externalId);

    UserRepository.lastId += 1;

    if (!someUsers) {
      await aUser.password.generate();

      const aNewUser = new User({
        ...aUser,
        id: UserRepository.lastId,
      });
      aUser.id = aNewUser.id;

      this.syncStorage(aNewUser);

      return;
    }

    const aNewUser = new User({
      ...aUser,
      externalId: randomUUID(),
      id: UserRepository.lastId,
    });
    aUser.id = aNewUser.id;

    this.syncStorage(aNewUser);
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

          this.syncStorage(aNewUser);
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
          aLoadedUser.invalidate(new Error("Removed"));

          this.syncStorage(aLoadedUser);
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

    this.logger.debug("findGroupByIds", {
      groupByIds,
      usersStorage: UserRepository.storage,
    });

    return either.right(groupByIds);
  }

  private syncStorage(user: User): void {
    if (user.isPersisted() && user.isValid()) {
      UserRepository.storage.set(user.externalId, user);
      UserRepository.storageIndexById.set(user.id, user.externalId);
      UserRepository.storageIndexByEmail.set(user.email, user.externalId);

      return;
    }

    UserRepository.storage.delete(user.externalId);
    UserRepository.storageIndexById.delete(user.id);
    UserRepository.storageIndexByEmail.delete(user.email);
  }
}
