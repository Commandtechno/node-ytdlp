import { join } from "path";

import { BIN_DIR } from "./constants";

export function getYtdlpPath(): string {
  switch (process.platform) {
    case "win32":
      return join(BIN_DIR, "bindows.exe");

    case "linux":
      return join(BIN_DIR, "binux");

    case "darwin":
      return join(BIN_DIR, "bacos");

    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}

export function splitFirst(str: string, delimiter: string): [string, string] {
  const [first, ...rest] = str.split(delimiter);
  return [first, rest.join(delimiter)];
}

export function camelCase(str: string): string {
  const [first, ...rest] = str.split(/[^\w]/);
  return [first, ...rest.map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())].join("");
}