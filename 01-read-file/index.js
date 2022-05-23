const fs = require("fs");
const path = require("path");

let data = " ";

const readStream = new fs.createReadStream(path.join(__dirname, "text.txt"));

readStream.on("data", (chunk)=> (data += chunk));
readStream.on("end", () => console.log(data));
readStream.on("error", (error) => console.log("Error", error.message));
