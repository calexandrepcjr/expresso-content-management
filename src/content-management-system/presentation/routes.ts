import { Routing, DependsOnMethod } from "express-zod-api";
import { createPost } from "./controllers/createPost";
import { getHealth } from "./controllers/getHealth";
import { getRoot } from "./controllers/getRoot";
import { getPosts } from "./controllers/getPosts";
import { getPostById } from "./controllers/getPostById";

export const routes: Routing = {
  cms: {
    "": getRoot,
    posts: {
      "": new DependsOnMethod({
        get: getPosts,
        post: createPost,
      }),
      ":postId": new DependsOnMethod({
        post: createPost,
        get: getPostById,
      }),
    },
    health: getHealth,
  },
};
