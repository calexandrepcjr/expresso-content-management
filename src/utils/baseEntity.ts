import { ModelFromEntity } from "./modelFromEntity";

export abstract class BaseEntity {
  private _invalidationReason?: Error | undefined;
  public readonly id: number;

  public constructor(aModel: ModelFromEntity<BaseEntity>) {
    this.id = aModel.id;
  }

  public invalidate(anError?: Error): void {
    this._invalidationReason = anError ?? new Error("Unknown reason");
  }

  public isValid(): boolean {
    return this._invalidationReason === undefined;
  }

  // INFO: No monads/optionals here: consider calling isValid at first for now
  public invalidationReason(): Error {
    const reason = this._invalidationReason ?? new Error("");

    // TODO: Remove when replacing js in-memory usage
    this._invalidationReason = undefined;

    return reason;
  }

  public isPersisted(): boolean {
    return this.id > 0;
  }
}
