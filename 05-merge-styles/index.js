const path = require("path");
const mergeFiles = require("./merge-styles");

mergeFiles(
  path.join(__dirname, "styles"),
  path.join(__dirname, "project-dist"),
  "bundle.css"
).then(() => {
  console.log("done");
});
