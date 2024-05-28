export abstract class BaseEntity {
  public constructor(public readonly id: number) {}

  public isPersisted(): boolean {
    return this.id > 0;
  }
}
