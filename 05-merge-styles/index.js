const fs = require("fs");
const path = require("path");
const bundle = fs.createWriteStream(
  path.join(__dirname, "project-dist", "bundle.css")
);

function addFile(file) {
  const readStream = fs.createReadStream(path.join(__dirname, "styles", file));

  readStream.pipe(bundle);
  readStream.on("error", (error) => console.log(error));
}

const mergeFiles = (dir) => {
  fs.readdir(dir, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.log(error);
    }

    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === ".css") {
        addFile(file.name);
      }
    });
  });
};

mergeFiles(path.join(__dirname, "styles"));
