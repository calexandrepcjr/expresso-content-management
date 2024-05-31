import { Routing, DependsOnMethod } from "express-zod-api";
import { createUser } from "@src/auth/presentation/controllers/createUser";
import { loginUser } from "./controllers/loginUser";

export const routes: Routing = {
  auth: {
    users: {
      signup: new DependsOnMethod({
        post: createUser,
      }),
      login: new DependsOnMethod({
        post: loginUser,
      }),
    },
  },
};
