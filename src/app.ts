import express, { NextFunction, Request, Response, Router } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { normalizePort } from "@src/utils/normalizePort";
import { loadModule } from "@src/content-management-system/application/loadModule";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { filterPrivateProperties } from "@src/utils/middlewares/filterPrivateProperties";
import { nativeJavascriptTransformer } from "@src/utils/middlewares/nativeJavascriptTransformer";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(nativeJavascriptTransformer);
app.use(filterPrivateProperties);

// INFO: Load base route
const router = Router();

router.get(`/`, (_r: Request, res: Response, _: NextFunction) => {
  res.status(HttpStatusCode.OK).json({
    appName: process.env["APP_NAME"],
  });
});
app.use("/", router);

// INFO: Loaded Modules
loadModule(app);

// INFO: catch 404 and forward to error handler
app.use((_r: Request, _re: Response, next: NextFunction) => {
  const err = new Error("Not Found");
  next(err);
});

// INFO: error handler
app.use((err: any, req: Request, res: Response, _: NextFunction) => {
  res.locals["message"] = err.message;
  res.locals["error"] = req.app.get("env") === "development" ? err : {};

  res.status(err.status ?? 500);
  res.render("error");
});

const port = normalizePort(process.env["PORT"] ?? "3000");
app.set("port", port);

export default app;
