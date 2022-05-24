// const path = require("path");
// const fs = require("fs");

// const readFileAsync = (filePath) => {
//   let data = "";

//   return new Promise((resolve, reject) => {
//     const readStream = new fs.createReadStream(filePath);
//     readStream.on("data", (chunk) => (data += chunk));
//     readStream.on("end", () => resolve(data));
//     readStream.on("error", (error) => reject(error));
//   });
// };

// const addFile = (fileName, sourceDir, targetDir, targetFileName) => {
//   return readFileAsync(path.join(sourceDir, fileName)).then((fileContent) => {
//     return fs.promises.appendFile(
//       path.join(targetDir, targetFileName),
//       fileContent
//     );
//   });
// };

// const mergeFiles = (sourceDir, targetDir, targetFileName) => {
//   return fs.promises
//     .writeFile(path.join(targetDir, targetFileName), "")
//     .then(() =>
//       fs.promises
//         .readdir(sourceDir, { withFileTypes: true })
//         .then((files) =>
//           Promise.all(
//             files
//               .filter(
//                 (file) => file.isFile() && path.extname(file.name) === ".css"
//               )
//               .map((file) =>
//                 addFile(file.name, sourceDir, targetDir, targetFileName)
//               )
//           )
//         )
//     );
// };

// module.exports = mergeFiles;
