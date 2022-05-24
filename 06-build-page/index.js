const writeFile = require("../02-write-file/write-file");
const fs = require("fs");
const path = require("path");
const readFileAsync = require("../01-read-file/read-file-async");
const templatePath = path.join(__dirname, "template.html");
const mergeFiles = require("../05-merge-styles/merge-styles");
const makeCopy = require("../04-copy-directory/copy-directory");

function createDir() {
  const dirPath = path.join(__dirname, "project-dist");

  return fs.promises
    .mkdir(dirPath, { recursive: true })
    .then(() => Promise.resolve(dirPath));
}

const getComponentPath = (componentName) => {
  const componentPath = path.join(
    __dirname,
    "components",
    `${componentName.replaceAll("{", "").replaceAll("}", "").trim()}.html`
  );
  return componentPath;
};
const getComponentContent = (componentPath) => readFileAsync(componentPath);
const getComponentContentByNameAsync = (componentName) => {
  const componentPath = getComponentPath(componentName);
  return getComponentContent(componentPath);
};

const compileTemplate = (templatePath) => {
  return readFileAsync(templatePath)
    .then((template) => {
      const regExp = /{{.+}}/gm;
      const parsedResults = [...template.matchAll(regExp)];
      const uniqueComponentNames = [
        ...new Set(parsedResults.map((value) => value[0])),
      ];

      const contentMapPromise = uniqueComponentNames.reduce(
        async (mapPromise, componentName) => {
          const map = await mapPromise;
          map.set(
            componentName,
            await getComponentContentByNameAsync(componentName)
          );
          return map;
        },
        Promise.resolve(new Map())
      );

      return contentMapPromise.then((contentMap) =>
        Promise.resolve({ contentMap, template })
      );
    })
    .then(({ contentMap, template }) => {
      const regExp = new RegExp([...contentMap.keys()].join("|"), "g");
      const resultHTML = template.replace(regExp, (match) =>
        contentMap.get(match)
      );
      return resultHTML;
    });
};

const a = async () => {
  // create index.html
  const compiledHTML = await compileTemplate(templatePath);
  const dirPath = await createDir();
  await writeFile(path.join(dirPath, "index.html"), compiledHTML);

  // create styles
  await mergeFiles(
    path.join(__dirname, "styles"),
    path.join(__dirname, "project-dist"),
    "style.css"
  );

  // copy assets
  await makeCopy(path.join(__dirname,"assets"), path.join(__dirname,"project-dist", "assets"));
};

a().then(() => {
  console.log("done");
});
