import { existsSync } from "node:fs";
import path from "node:path";

/** True if a file exists under public/ at build time (for optional images). */
export function publicFileExists(src: string) {
  return existsSync(path.join(process.cwd(), "public", src));
}
