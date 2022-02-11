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
    ytdlpStream(url, options).then(res => {
      res.stdout.on("data", data => console.log(data.toString().trim()));
      res.stderr.on("data", data => console.log(data.toString().trim()));
      res.on("close", code => console.log(`child process exited with code ${code}`));
    });
  });