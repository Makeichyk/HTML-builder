const path = require("path");
const fs = require("fs");

async function makeCopy(src, copy) {
  try {
    await fs.promises.rm(copy, { recursive: true });
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn(err.message);
    } else {
      throw err;
    }
  }
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
}

const sourcePath = path.join(__dirname, "files");
const copyPath = path.join(__dirname, "files-copy");

makeCopy(sourcePath, copyPath);
