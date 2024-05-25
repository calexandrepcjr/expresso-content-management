import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./presentation/controllers/index";
import { normalizePort } from "./utils/normalizePort";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// INFO: API Routes
app.use("/", indexRouter);

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
