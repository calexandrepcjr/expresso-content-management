import { NextFunction, Request, Response } from "express";
import { isDate } from "@src/utils/isDate";

export function filterPrivateProperties(
  _: Request,
  res: Response,
  next: NextFunction,
): void {
  console.debug("Filter Private Properties Middleware Ran");

  const originalSend = res.send;
  const originalJson = res.json;

  res.send = function (data: unknown) {
    if (typeof data === "object") {
      data = stripPrivateProperties(data);
    }

    return originalSend.call(this, data);
  };
  res.json = function (data: unknown) {
    if (typeof data === "object") {
      data = stripPrivateProperties(data);
    }

    return originalJson.call(this, data);
  };

  next();
}

function stripPrivateProperties<T>(anObject: T): T {
  if (Array.isArray(anObject)) {
    return anObject.map((item) => stripPrivateProperties(item)) as unknown as T;
  }

  if (anObject !== null && typeof anObject === "object" && !isDate(anObject)) {
    const result = {} as T;

    for (const key in anObject) {
      if (
        Object.prototype.hasOwnProperty.call(anObject, key) &&
        !key.startsWith("_")
      ) {
        (result as any)[key] = stripPrivateProperties((anObject as any)[key]);
      }
    }

    return result;
  }

  return anObject;
}
