import { BaseEntity } from "@src/utils/baseEntity";
import { ModelFromEntity } from "@src/utils/modelFromEntity";
import { randomUUID } from "crypto";
import { UserExternalId } from "@src/auth/domain/interfaces/userExternalId";

export class User extends BaseEntity {
  public readonly externalId: UserExternalId;
  public readonly fullName: string;
  public readonly email: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(_theModel: ModelFromEntity<User>) {
    super(_theModel);

    this.externalId = _theModel.externalId ?? randomUUID();
    this.fullName = _theModel.fullName ?? "Unknown";
    this.email = _theModel.email ?? "unknown@invalid.com";
    this.createdAt = _theModel.createdAt ?? new Date();
    this.updatedAt = _theModel.updatedAt ?? new Date();
  }

  // INFO: Null object pattern
  public static empty(): User {
    return new User({
      id: -1,
      fullName: "Null",
      email: "null@null.com",
      externalId: "invalid",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
