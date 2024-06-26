import { Routing, DependsOnMethod } from "express-zod-api";
import { createPost } from "@src/content-management-system/presentation/controllers/createPost";
import { getHealth } from "@src/content-management-system/presentation/controllers/getHealth";
import { getRoot } from "@src/content-management-system/presentation/controllers/getRoot";
import { getPosts } from "@src/content-management-system/presentation/controllers/getPosts";
import { getPostById } from "@src/content-management-system/presentation/controllers/getPostById";
import { updateWholePost } from "@src/content-management-system/presentation/controllers/updateWholePost";
import { removeAllUserPosts } from "@src/content-management-system/presentation/controllers/removeAllUserPosts";
import { updatePostPartially } from "@src/content-management-system/presentation/controllers/updatePostPartially";

export const routes: Routing = {
  cms: {
    "": getRoot,
    posts: {
      "": new DependsOnMethod({
        get: getPosts,
        post: createPost,
        delete: removeAllUserPosts,
      }),
      ":postId": new DependsOnMethod({
        get: getPostById,
        put: updateWholePost,
        patch: updatePostPartially,
      }),
    },
    health: getHealth,
  },
};
