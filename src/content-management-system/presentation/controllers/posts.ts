import { Router, Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { PostRepository } from "@src/content-management-system/infrastructure/in-memory/repositories/postRepository";
import { Config } from "@src/content-management-system/config/config";
import { pipe } from "fp-ts/lib/function";
import { either } from "fp-ts";

const router = Router();
// TODO: Use DI
const postsRepository = new PostRepository();

router.get("/posts", async (_r: Request, res: Response, _: NextFunction) => {
  // TODO: Use Use case instead
  const maybePosts = await postsRepository.findAll(Config.RootUserId);

  pipe(
    maybePosts,
    either.match(
      (anError) => {
        res.status(HttpStatusCode.InternalServerError).json({
          errors: [
            {
              name: anError.name,
              message: anError.message,
            },
          ],
          posts: [],
        });
      },
      (posts) => {
        res.status(HttpStatusCode.OK).json({
          posts,
        });
      },
    ),
  );
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

    pipe(
      maybePost,
      either.match(
        (anError) => {
          res.status(HttpStatusCode.InternalServerError).json({
            errors: [
              {
                name: anError.name,
                message: anError.message,
              },
            ],
            posts: [],
          });
        },
        (post) => {
          res.status(HttpStatusCode.OK).json({
            post,
          });
        },
      ),
    );
  },
);

export default router;
