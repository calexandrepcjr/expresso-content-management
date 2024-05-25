import { Router, Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../utils/httpStatusCode";

const router = Router();

router.get("/", (_r: Request, res: Response, _: NextFunction) => {
  res.status(HttpStatusCode.OK).json({
    appName: process.env["APP_NAME"],
    title: "Expresso Content Management",
    content: "A Simple Content Management System",
  });
});

router.get("/health", (_r: Request, res: Response, _: NextFunction) => {
  res.status(HttpStatusCode.OK).json({
    receivedAt: new Date(),
  });
});

export default router;
