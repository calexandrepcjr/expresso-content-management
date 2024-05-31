import { Routing, DependsOnMethod } from "express-zod-api";
import { createUser } from "@src/auth/presentation/controllers/createUser";

export const routes: Routing = {
  auth: {
    users: {
      signup: new DependsOnMethod({
        post: createUser,
      }),
    },
  },
};
