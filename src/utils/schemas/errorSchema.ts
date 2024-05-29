import { z } from "zod";

export const ErrorSchema = z.object({
  errors: z.array(
    z.object({
      name: z.string(),
      message: z.string(),
    }),
  ),
});
