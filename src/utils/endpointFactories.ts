import {
  EndpointsFactory,
  createResultHandler,
  defaultResultHandler,
  getStatusCodeFromError,
} from "express-zod-api";
import { HttpStatusCode } from "@src/utils/httpStatusCode";
import { z } from "zod";
import { config } from "@src/config";

/** @desc The factory assures the endpoints tagging constraints from config */
export const taggedEndpointsFactory = new EndpointsFactory({
  resultHandler: defaultResultHandler,
  config,
});

/** @desc The factory demonstrates slightly different response schemas depending on the negative status code */
export const statusDependingFactory = new EndpointsFactory({
  config,
  resultHandler: createResultHandler({
    getPositiveResponse: (output) => ({
      statusCodes: [HttpStatusCode.Created, HttpStatusCode.Accepted],
      schema: z.object({ status: z.literal("created"), data: output }),
    }),
    getNegativeResponse: () => [
      {
        statusCode: HttpStatusCode.Conflict,
        schema: z.object({ status: z.literal("exists"), id: z.number().int() }),
      },
      {
        statusCodes: [
          HttpStatusCode.BadRequest,
          HttpStatusCode.InternalServerError,
        ],
        schema: z.object({ status: z.literal("error"), reason: z.string() }),
      },
    ],
    handler: ({ error, response, output }) => {
      if (error) {
        const code = getStatusCodeFromError(error);

        response.status(code).json(
          code === HttpStatusCode.Conflict &&
            "id" in error &&
            typeof error.id === "number"
            ? {
                status: "exists",
                id: error.id,
              }
            : { status: "error", reason: error.message },
        );
        return;
      }

      response
        .status(HttpStatusCode.Created)
        .json({ status: "created", data: output });
    },
  }),
});
