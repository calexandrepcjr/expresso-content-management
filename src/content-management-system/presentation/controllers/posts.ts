import { Router, Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { Post } from "@src/content-management-system/domain/entities/post";

const router = Router();

router.get("/posts", (_r: Request, res: Response, _: NextFunction) => {
  const posts = [
    new Post({
      id: 1,
      category: "Nerdy stuff",
      content: "Testing some nerdy stuff",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Post({
      id: 2,
      category: "Career",
      content: "A serious blog post regarding career",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ];

  res.status(HttpStatusCode.OK).json({
    posts,
  });
});

export default router;
