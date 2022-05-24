const fs = require("fs");
const path = require("path");

const fileData = (directory) => {
  fs.readdir(directory, { withFileTypes: true }, (error, files) => {
    if (error) console.log(error);

    files.forEach((item) => {
      if (item.isFile()) {
        let resultStr = "";
        let fileName = item.name.split(".")[0];
        let extention = path.extname(item.name).split(".").join("");

        fs.stat(path.join(directory, item.name), true, (err, data) => {
          let size = data.size;
          resultStr = `${fileName} - ${extention} - ${size}bit`;
          console.log(resultStr);
        });
      } else {
        // console.log(`Папка - ${item.name}`);
      }
    });
  });
};

fileData(path.join(__dirname, "secret-folder"));
