import { Either } from "fp-ts/lib/Either";
import { User } from "@src/auth/domain/entities/user";
import { UserExternalId } from "@src/auth/domain/interfaces/userExternalId";

export interface UserRepository {
  findGroupByIds(ids: number[]): Promise<Either<Error, Map<number, User>>>;
  findByExternalId(
    userExternalId: UserExternalId,
  ): Promise<Either<Error, User>>;
  findById(userId: number): Promise<Either<Error, User>>;
}
