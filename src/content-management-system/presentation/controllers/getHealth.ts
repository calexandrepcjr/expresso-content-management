import { z } from "zod";
import { taggedEndpointsFactory } from "@src/utils/endpointFactories";
import { ez } from "express-zod-api";

export const getHealth = taggedEndpointsFactory.build({
  method: "get",
  tag: "content-management-system",
  shortDescription: "Retrieves CMS health.",
  input: z.object({}),
  output: z.object({
    receivedAt: ez.dateOut(),
  }),
  handler: async () => ({
    receivedAt: new Date(),
  }),
});
