import { Router, Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "@src/utils/httpStatusCode";

const router = Router();

router.get("/posts", (_r: Request, res: Response, _: NextFunction) => {
  res.status(HttpStatusCode.OK).json({});
});

export default router;
