import { BaseEntity } from "@src/utils/baseEntity";
import { ModelFromEntity } from "@src/utils/modelFromEntity";
import { randomUUID } from "crypto";
import { UserExternalId } from "@src/auth/domain/interfaces/userExternalId";
import { Password } from "@src/auth/domain/value-objects/password";

interface NewUser {
  email: string;
  fullName: string;
  password: string;
}

export class User extends BaseEntity {
  public readonly externalId: UserExternalId;
  public readonly fullName: string;
  public readonly email: string;
  public readonly password: Password;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(_theModel: ModelFromEntity<User>) {
    super(_theModel);

    this.externalId = _theModel.externalId ?? randomUUID();
    this.fullName = _theModel.fullName ?? "Unknown";
    this.email = _theModel.email ?? "unknown@invalid.com";
    this.password = _theModel.password ?? new Password("1234");
    this.createdAt = _theModel.createdAt ?? new Date();
    this.updatedAt = _theModel.updatedAt ?? new Date();
  }

  public static new(rawUser: NewUser): User {
    return new User({
      ...rawUser,
      password: new Password(rawUser.password),
      id: 0,
      externalId: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // INFO: Null object pattern
  public static empty(): User {
    return new User({
      id: -1,
      fullName: "Null",
      email: "null@null.com",
      password: new Password(""),
      externalId: "invalid",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public toJSON(): object {
    return {
      ...this,
      password: undefined,
    };
  }
}
