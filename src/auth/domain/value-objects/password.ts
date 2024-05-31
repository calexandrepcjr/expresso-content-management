import bcrypt from "bcrypt";

export class Password {
  private _value: string = "";
  private static readonly SALT_ROUNDS = 10;

  public constructor(private readonly _rawValue: string) {}

  public async generate(): Promise<string> {
    this._value = await bcrypt.hash(this._rawValue, Password.SALT_ROUNDS);

    return this._value;
  }

  public async check(rawValue?: string): Promise<boolean> {
    return bcrypt.compare(rawValue ?? this._rawValue, this._value);
  }

  public toJSON(): string {
    return this._value;
  }
}
