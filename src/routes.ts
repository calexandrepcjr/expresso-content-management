import { routes as cmsRoutes } from "@src/content-management-system/presentation/routes";
import { defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";

export const routes = {
  "": defaultEndpointsFactory.build({
    method: "get",
    shortDescription: "API home",
    input: z.object({}),
    output: z.object({
      greetings: z.string(),
    }),
    handler: async ({ input, options, logger }) => {
      logger.debug("Received:", {
        options,
        input,
      });

      return {
        greetings: "Check the routes in the Swagger UI, routing to /api-docs",
      };
    },
  }),
  ...cmsRoutes,
};
