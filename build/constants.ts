import { resolve, join } from "path";

export const BASE_DIR = resolve(__dirname, "..");
export const BIN_DIR = join(BASE_DIR, "bin");
export const OUTPUT_FILE = join(BASE_DIR, "index.ts");
export const RELEASES_URL = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/";