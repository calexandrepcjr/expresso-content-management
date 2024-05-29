import { writeFile } from "node:fs/promises";
import { config } from "@src/config";
import { routes as routing } from "@src/routes";
import manifest from "../package.json";
import { Documentation } from "express-zod-api";
import { normalizePort } from "@src/utils/normalizePort";

const port = normalizePort(process.env["PORT"] ?? "3000");

// TODO: Add hook with Husky to trigger documentation generation if there are changes in the routes

await writeFile(
  "documentation.yaml",
  new Documentation({
    routing,
    config,
    version: manifest.version,
    title: manifest.name,
    serverUrl: `http://localhost:${port}`,
  }).getSpecAsYaml(),
  "utf-8",
);
