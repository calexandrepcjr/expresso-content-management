import indexRouter from "@src/content-management-system/presentation/controllers/index";
import { Express } from "express";

export function loadModule(app: Express): void {
  app.use("/", indexRouter);
}
