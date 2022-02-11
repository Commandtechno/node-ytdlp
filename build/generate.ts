import { camelCase } from "./util";
import { Option } from "./types";

export default function (options: Option[]) {
  console.log("Building typescript...");

  let ts = "";
  ts += 'import { exec, execSync, spawn } from "child_process";\n';
  ts += 'import { join } from "path";\n';

  ts += "\n";
  ts += "export let ytdlpPath: string;\n";

  ts += "\n";
  ts += "switch (process.platform) {\n";
  ts += '\tcase "win32":\n';
  ts += '\t\tytdlpPath = join(__dirname, "bin", "bindows.exe");\n';
  ts += "\t\tbreak;\n";

  ts += "\n";
  ts += '\tcase "linux":\n';
  ts += '\t\tytdlpPath = join(__dirname, "bin", "binux");\n';
  ts += "\t\tbreak;\n";

  ts += "\n";
  ts += '\tcase "darwin":\n';
  ts += '\t\tytdlpPath = join(__dirname, "bin", "bacos");\n';
  ts += "\t\tbreak;\n";

  ts += "\n";
  ts += "\tdefault:\n";
  ts += "\t\tthrow new Error(`Unsupported platform: ${process.platform}`);\n";
  ts += "}\n";

  ts += "\n";
  ts += "export interface Options {\n";
  for (let option of options) {
    ts += "\t/**\n";
    ts += `\t * @description ${option.description}\n`;
    ts += "\t */\n";
    // todo: make cooler
    ts += `\t${camelCase(option.name)}?: ${option.args ? "string | string[]" : "boolean"}\n`;
  }
  ts += "}\n";

  ts += "\n";
  ts += "export function formatOptions(options: Options = {}): string[] {\n";
  ts += "\tconst args: string[] = [];\n";
  for (let option of options) {
    ts += `\tif (options.${camelCase(option.name)}) {\n`;
    ts += `\t\targs.push("--${option.name}");\n`;
    if (option.args) {
      ts += `\t\tif (typeof options.${camelCase(
        option.name
      )} === "string") args.push(options.${camelCase(option.name)});\n`;
      ts += `\t\telse args.push(...options.${camelCase(option.name)});\n`;
    }
    ts += "\t};\n";
    ts += "\n";
  }
  ts += "\treturn args;\n";
  ts += "}\n";

  ts += "\n";
  ts += "export function ytdlp(url: string, options: Options = {}): Promise<string> {\n";
  ts += "\treturn new Promise((resolve, reject) => {\n";
  ts +=
    '\t\texec(ytdlpPath + " " + url + " " + formatOptions(options).join(" "), (error, stdout, stderr) => {\n';
  ts += "\t\t\tif (error) return reject(error);\n";
  ts += "\t\t\tif (stderr) return reject(stderr);\n";
  ts += "\t\t\tresolve(stdout);\n";
  ts += "\t\t});\n";
  ts += "\t});\n";
  ts += "}\n";

  ts += "\n";
  ts += "export function ytdlpSync(url: string, options: Options = {}): string {\n";
  ts +=
    '\treturn execSync(ytdlpPath + " " + url + " " + formatOptions(options).join(" ")).toString();\n';
  ts += "}\n";

  ts += "\n";
  ts +=
    "export function ytdlpStream(url: string, options: Options = {}): Promise<ReturnType<typeof spawn>> {\n";
  ts += "\treturn new Promise((resolve, reject) => {\n";
  ts += "\t\tconst child = spawn(ytdlpPath, [url, ...formatOptions(options)]);\n";
  ts += "\t\tresolve(child);\n";
  ts += "\t});\n";
  ts += "}\n";

  return ts;
}