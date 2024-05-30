import { z } from "zod";

export const UserExternalIdSchema = z
  .string()
  .uuid()
  .describe("An UUID representing the User");
