import { spawn } from "child_process";

import { getYtdlpPath, splitFirst } from "./util";
import { Option } from "./types";

const ytdlpPath = getYtdlpPath();

export default function () {
  let options: Option[] = [];
  let option: Partial<Option> | null = null;

  console.log("Parsing help output...");
  return new Promise<Option[]>((resolve, reject) => {
    const child = spawn(ytdlpPath, ["--help"]);
    child.stdout.on("data", (chunk: Buffer) => {
      for (let line of chunk.toString().split("\n")) {
        let depth = line.length - line.trimStart().length;
        line = line.trim();

        if (depth === 2) {
          if (option) {
            options.push(option as Option);
            option = null;
          }

          continue;
        }

        if (depth === 4 && line.includes("--")) {
          if (option) options.push(option as Option);
          option = {};

          [, line] = splitFirst(line, "--");

          let name: string;
          [name, line] = splitFirst(line, " ");
          option.name = name;

          let args: string;
          [args, line] = splitFirst(line, "  ");
          if (args) option.args = args.split(" ");

          option.description = line.trim();
          continue;
        }

        if (option) option.description += " " + line.trim();
      }
    });

    let error = "";
    child.stderr.on("data", (chunk: Buffer) => (error += chunk.toString()));
    child.on("close", () => {
      if (error) reject(error);
      else resolve(options);
    });
  });
}