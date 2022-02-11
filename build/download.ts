import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { get } from "https";

import { BIN_DIR, RELEASES_URL } from "./constants";
import { execSync } from "child_process";

function fetch(_url: string, file: string) {
  const url = new URL(_url, RELEASES_URL);
  const path = join(BIN_DIR, file);
  return new Promise((resolve, reject) => {
    get(url, res => {
      if (res.statusCode === 302) return resolve(fetch(res.headers.location as string, file));
      if (res.statusCode !== 200)
        return reject(new Error(`${url} responded with ${res.statusCode}: ${res.statusMessage}`));

      res.pipe(createWriteStream(path));
      res.on("end", () => resolve(null));
    });
  });
}

export default async function () {
  if (!existsSync(BIN_DIR)) mkdirSync(BIN_DIR);

  console.log("Downloading 🅱️inux");
  await fetch("yt-dlp", "binux");
  // idk what else to do might make less scuffed later
  execSync("chmod +x " + join(BIN_DIR, "binux"));

  console.log("Downloading 🅱️indows");
  await fetch("yt-dlp", "bindows.exe");

  console.log("Downloading 🅱️acos");
  await fetch("yt-dlp", "bacos");
}