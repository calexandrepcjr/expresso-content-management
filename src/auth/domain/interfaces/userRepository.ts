import { UserId } from "@src/auth/domain/interfaces/userId";
import { Either } from "fp-ts/lib/Either";
import { User } from "@src/auth/domain/entities/user";

export interface UserRepository {
  findByExternalId(userId: UserId): Promise<Either<Error, User>>;
}
