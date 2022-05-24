const readFileAsync = require("./read-file-async");
const path = require("path");

let filePath = path.join(__dirname, "text.txt");

const resultPromise = readFileAsync(filePath);
resultPromise
  .then((res) => console.log(res))
  .catch((error) => console.error(error));
