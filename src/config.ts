import { normalizePort } from "@src/utils/normalizePort";
import { filterPrivateProperties } from "@src/utils/middlewares/filterPrivateProperties";
import { nativeJavascriptTransformer } from "@src/utils/middlewares/nativeJavascriptTransformer";
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";
import { readFile } from "node:fs/promises";
import { createConfig } from "express-zod-api";

const port = normalizePort(process.env["PORT"] ?? "3000");

export const config = createConfig({
  server: {
    listen: port,
    beforeRouting: async ({ app, logger }) => {
      app.use(nativeJavascriptTransformer);
      app.use(filterPrivateProperties);
      logger.info("Serving the API documentation at /api-docs");

      const documentation = yaml.parse(
        await readFile("./documentation.yaml", "utf-8"),
      );
      app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(documentation));
    },
  },
  cors: false,
  logger: {
    level: "debug",
    color: true,
  },
});
