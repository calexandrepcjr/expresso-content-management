import { User } from "@src/auth/domain/entities/user";
import { BaseEntity } from "@src/utils/baseEntity";
import { ModelFromEntity } from "@src/utils/modelFromEntity";

export class Post extends BaseEntity {
  public readonly category: string;
  public readonly content: string;
  public readonly authorId: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(_theModel: ModelFromEntity<Post>) {
    super(_theModel);

    this.category = _theModel.category;
    this.content = _theModel.content;
    this.authorId = _theModel.authorId;
    this.createdAt = _theModel.createdAt ?? new Date();
    this.updatedAt = _theModel.updatedAt ?? new Date();
  }

  public static new(category: string, content: string, author: User): Post {
    return new Post({
      id: 0,
      category,
      content,
      authorId: author.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // INFO: Null object pattern
  public static empty(): Post {
    return new Post({
      id: -1,
      category: "null",
      content: "",
      authorId: -1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
