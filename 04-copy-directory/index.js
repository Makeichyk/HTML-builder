const path = require("path");
const fs = require("fs");
// const makeCopy = require("./copy-directory");

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

const sourcePath = path.join(__dirname, "files");
const copyPath = path.join(__dirname, "files-copy");

makeCopy(sourcePath, copyPath);
