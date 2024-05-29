import { createServer } from "express-zod-api";
import { config } from "./config";
import { routes } from "./routes";

await createServer(config, routes);
