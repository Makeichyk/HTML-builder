const fs = require("fs");
const path = require("path");

const readStream = new fs.ReadStream(path.join(__dirname, "text.txt"), "utf-8");

let data = " ";

readStream.on("error", (error) => console.log("Error", error.message));
readStream.on("data", (chunk) => (data += chunk));
readStream.on("end", () => console.log(data));
