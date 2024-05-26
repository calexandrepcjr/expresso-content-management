import indexRouter from "@src/content-management-system/presentation/controllers/index";
import postsRouter from "@src/content-management-system/presentation/controllers/posts";
import { Express } from "express";
import { Config } from "@src/content-management-system/config/config";

export function loadModule(app: Express): void {
  app.use(`/${Config.BaseUrl}`, indexRouter);
  app.use(`/${Config.BaseUrl}`, postsRouter);
}
