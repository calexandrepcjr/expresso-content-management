import { z } from "zod";
import { taggedEndpointsFactory } from "@src/utils/endpointFactories";

export const getRoot = taggedEndpointsFactory.build({
  method: "get",
  tag: "content-management-system",
  shortDescription: "Retrieves CMS base info.",
  input: z.object({}),
  output: z.object({
    appName: z.string(),
    title: z.string(),
    content: z.string(),
  }),
  handler: async () => ({
    appName: process.env["APP_NAME"] ?? "Default App",
    title: "Expresso Content Management",
    content: "A Simple Content Management System",
  }),
});
