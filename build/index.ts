import { writeFileSync } from "fs";

import { OUTPUT_FILE } from "./constants";

import download from "./download";
import generate from "./generate";
import parse from "./parse";

(async () => {
  await download();
  const options = await parse();
  const output = await generate(options);
  writeFileSync(OUTPUT_FILE, output);
})();