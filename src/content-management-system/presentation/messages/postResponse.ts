import { User } from "@src/auth/domain/entities/user";
import { Post } from "@src/content-management-system/domain/entities/post";

export class PostResponse {
  public readonly id: number;
  public readonly category: string;
  public readonly content: string;
  public readonly author: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(post: Post, author: User) {
    this.id = post.id;
    this.category = post.category;
    this.content = post.content;
    this.author = author.fullName;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}
