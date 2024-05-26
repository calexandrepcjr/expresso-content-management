import { BaseEntity } from "@src/utils/baseEntity";
import { ModelFromEntity } from "@src/utils/modelFromEntity";

export class Post extends BaseEntity {
  public readonly category: string;
  public readonly content: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(private _theModel: ModelFromEntity<Post>) {
    super(_theModel.id);

    this.category = this._theModel.category;
    this.content = this._theModel.content;
    this.createdAt = this._theModel.createdAt;
    this.updatedAt = this._theModel.updatedAt;
  }
}
