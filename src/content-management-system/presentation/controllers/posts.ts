import { Router, Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostRepository } from "@src/content-management-system/infrastructure/in-memory/repositories/postRepository";
import { Config } from "@src/content-management-system/config/config";
import { isLeft } from "fp-ts/lib/Either";

const router = Router();
// TODO: Use DI
const postsRepository = new PostRepository();

router.get("/posts", async (_r: Request, res: Response, _: NextFunction) => {
  // TODO: Use Use case instead
  const maybePosts = await postsRepository.findAll(Config.RootUserId);

  if (isLeft(maybePosts)) {
    const anError = maybePosts.left;

    res.status(HttpStatusCode.InternalServerError).json({
      errors: [
        {
          name: anError.name,
          message: anError.message,
        },
      ],
      posts: [],
    });

    return;
  }

  res.status(HttpStatusCode.OK).json({
    posts: maybePosts.right,
  });
});
router.get(
  "/posts/:postId",
  async (request: Request, res: Response, _: NextFunction) => {
    const postId = Number(request.params["postId"]);

    // TODO: Use Use case instead
    if (isNaN(postId)) {
      res.status(HttpStatusCode.UnprocessableEntity).json({
        errors: [
          {
            name: "InvalidPathParam",
            message: "Post Id must be a number",
          },
        ],
      });

      return;
    }

    const maybePost = await postsRepository.findById(Config.RootUserId, postId);

    if (isLeft(maybePost)) {
      const anError = maybePost.left;

      res.status(HttpStatusCode.InternalServerError).json({
        errors: [
          {
            name: anError.name,
            message: anError.message,
          },
        ],
        posts: [],
      });

      return;
    }

    res.status(HttpStatusCode.OK).json({
      post: maybePost.right,
    });
  },
);

export default router;
