const fs = require("fs");

const writeFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
};

module.exports = writeFile;
