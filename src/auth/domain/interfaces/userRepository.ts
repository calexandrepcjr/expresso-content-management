import { Either } from "fp-ts/lib/Either";
import { User } from "@src/auth/domain/entities/user";
import { UserExternalId } from "@src/auth/domain/interfaces/userExternalId";

export interface UserRepository {
  findByExternalId(userId: UserExternalId): Promise<Either<Error, User>>;
}
