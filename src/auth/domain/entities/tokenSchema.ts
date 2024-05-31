import { z } from "zod";
import { Value } from "../value";

export const TokenSchema = z.string().min(Value.MinBcryptSize);
