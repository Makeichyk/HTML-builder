const path = require("path");
const fs = require("fs");
const readFileAsync = require("../01-read-file/read-file-async");

const addFile = (fileName, sourceDir, targetDir, targetFileName) => {
  return readFileAsync(path.join(sourceDir, fileName)).then((fileContent) => {
    return fs.promises.appendFile(
      path.join(targetDir, targetFileName),
      fileContent
    );
  });
};

const mergeFiles = (sourceDir, targetDir, targetFileName) => {
  return fs.promises
    .writeFile(path.join(targetDir, targetFileName), "")
    .then(() =>
      fs.promises
        .readdir(sourceDir, { withFileTypes: true })
        .then((files) =>
          Promise.all(
            files
              .filter(
                (file) => file.isFile() && path.extname(file.name) === ".css"
              )
              .map((file) =>
                addFile(file.name, sourceDir, targetDir, targetFileName)
              )
          )
        )
    );
};

module.exports = mergeFiles;
