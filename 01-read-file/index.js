const path = require("path");
const fs = require("fs");

const readFileAsync = (filePath) => {
  let data = "";

  return new Promise((resolve, reject) => {
    const readStream = new fs.createReadStream(filePath);
    readStream.on("data", (chunk) => (data += chunk));
    readStream.on("end", () => resolve(data));
    readStream.on("error", (error) => reject(error));
  });
};

let filePath = path.join(__dirname, "text.txt");

const resultPromise = readFileAsync(filePath);
resultPromise
  .then((res) => console.log(res))
  .catch((error) => console.error(error));
