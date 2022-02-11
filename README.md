yet another stupid project i thought of and spent way too fucking long making

this was a test for ts generation and practice idk

sponsored by github copilot and my last two braincells

# exports

```ts
let ytdlpPath = "literally/the/path/to/the/ytdlp/executable";

interface Options {
  // all of the fucking options
  // they are all optional
  // if it has args then it can be string or string array
  // if it doesnt have args then its a boolean

  noMtime?: boolean;
  proxy?: string | string[];
}

// literally turns options into an array
function formatOptions(options: Options): string[];

// returns stdout or rejects with stderr
function ytdlp(url: string, options?: Options): Promise<string>;

// same as ytdlp but blocks the process queue
function ytdlpSync(url: string, options?: Options): string;

// use this if you dont need the output or need a stream idk
function ytdlpStream(url: string, options?: Options): ChildProcess;
```