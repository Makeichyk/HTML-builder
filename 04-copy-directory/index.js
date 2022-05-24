const path = require("path");
const makeCopy = require("./copy-directory");

const sourcePath = path.join(__dirname, "files");
const copyPath = path.join(__dirname, "files-copy");

makeCopy(sourcePath, copyPath);
