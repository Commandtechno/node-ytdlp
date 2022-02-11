import { ytdlp, ytdlpSync, ytdlpStream, Options } from ".";

const url: string = "https://www.youtube.com/watch?v=gzrEC3eNlQI";
const options: Options = { noMtime: true };

console.log("sync");
console.log(ytdlpSync(url, options));

ytdlp(url, options)
  .then(res => {
    console.log("normal");
    console.log(res);
  })
  .then(() => {
    console.log("stream");
    const stream = ytdlpStream(url, options);
    stream.stdout.on("data", data => console.log(data.toString().trim()));
    stream.stderr.on("data", data => console.log(data.toString().trim()));
    stream.on("close", code => console.log(`child process exited with code ${code}`));
  });