export function normalizePort(val: string): string {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return String(port);
  }

  return "3000";
}
