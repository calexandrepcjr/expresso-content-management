import { UserId } from "@src/auth/domain/interfaces/userId";
import { Post } from "@src/content-management-system/domain/entities/post";
import { Either } from "fp-ts/lib/Either";

export interface PostRepository {
  findAll(userId: UserId): Promise<Either<Error, Post[]>>;
  findById(userId: UserId, postId: number): Promise<Either<Error, Post>>;
  create(userId: UserId, aPost: Post): Promise<void>;
}
