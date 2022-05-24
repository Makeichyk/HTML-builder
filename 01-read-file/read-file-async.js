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

module.exports = readFileAsync;
