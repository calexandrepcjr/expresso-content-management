import { User } from "@src/auth/domain/entities/user";
import { Post } from "@src/content-management-system/domain/entities/post";
import { Either } from "fp-ts/lib/Either";

export interface PostRepository {
  // TODO: Consider pagination since it can return a considerable amount of data
  findAll(): Promise<Either<Error, Post[]>>;
  findById(postId: number): Promise<Either<Error, Post>>;
  create(user: User, aPost: Post): Promise<void>;
  update(user: User, aPost: Post): Promise<void>;
  removeByUser(user: User): Promise<void>;
}
