import { NextFunction, Request, Response } from "express";
import { isDate } from "@src/utils/isDate";

// INFO: Middleware to handle Map objects
export const nativeJavascriptTransformer = (
  _: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.debug("Native Javascript Transformer Middleware Ran");

  const originalJson = res.json;

  res.json = (body: unknown): Response => {
    const transformedBody = transformBody(body);

    return originalJson.call(res, transformedBody);
  };

  next();
};

const transformBody = (body: any): any => {
  if (body instanceof Map) {
    return Object.fromEntries(body);
  }

  if (Array.isArray(body)) {
    return body.map(transformBody);
  }

  if (body !== null && typeof body === "object" && !isDate(body)) {
    return Object.entries(body).reduce(
      (acc, [key, value]) => {
        acc[key] = transformBody(value);

        return acc;
      },
      {} as { [key: string]: any },
    );
  }

  return body;
};
