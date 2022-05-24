const fs = require("fs");
const path = require("path");

async function makeCopy(src, copy) {
  try {
    await fs.promises.mkdir(copy, { recursive: true });

    let files = await fs.promises.readdir(src, { withFileTypes: true });

    files.forEach((item) => {
      let fileCopy = path.join(copy, item.name);
      let fileSrc = path.join(src, item.name);

      if (item.isDirectory()) {
        makeCopy(fileSrc, fileCopy);
      } else {
        fs.promises.copyFile(fileSrc, fileCopy);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = makeCopy;
