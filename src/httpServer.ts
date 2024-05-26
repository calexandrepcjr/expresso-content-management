import http from "http";
import debugLib from "debug";
import app from "@src/app";
import { normalizePort } from "@src/utils/normalizePort";

const appName = process.env["APP_NAME"];
const debug = debugLib(`${appName}:server`);
const port = normalizePort(process.env["PORT"] ?? "3000");

const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  debug("Listening on " + bind);
}
