import { BaseEntity } from "./baseEntity";
import { InfrastructureModel } from "./infrastructureModel";

export type ModelFromEntity<T extends BaseEntity> = InfrastructureModel &
  Omit<T, "theModel" | "isPersisted">;
