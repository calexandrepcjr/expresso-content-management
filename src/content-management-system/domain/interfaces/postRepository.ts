import { User } from "@src/auth/domain/entities/user";
import { UserExternalId } from "@src/auth/domain/interfaces/userExternalId";
import { Post } from "@src/content-management-system/domain/entities/post";
import { Either } from "fp-ts/lib/Either";

export interface PostRepository {
  findAll(userId: UserExternalId): Promise<Either<Error, Post[]>>;
  findById(postId: number): Promise<Either<Error, Post>>;
  create(user: User, aPost: Post): Promise<void>;
  update(userId: UserExternalId, aPost: Post): Promise<void>;
  removeByUser(user: User): Promise<void>;
}
