// const writeFile = require("../02-write-file/write-file");
const fs = require("fs");
const path = require("path");
// const readFileAsync = require("../01-read-file/read-file-async");
const templatePath = path.join(__dirname, "template.html");
// const mergeFiles = require("../05-merge-styles/merge-styles");
// const makeCopy = require("../04-copy-directory/copy-directory");

const addFile = (fileName, sourceDir, targetDir, targetFileName) => {
  return readFileAsync(path.join(sourceDir, fileName)).then((fileContent) => {
    return fs.promises.appendFile(
      path.join(targetDir, targetFileName),
      fileContent
    );
  });
};

const mergeFiles = (sourceDir, targetDir, targetFileName) => {
  return fs.promises
    .writeFile(path.join(targetDir, targetFileName), "")
    .then(() =>
      fs.promises
        .readdir(sourceDir, { withFileTypes: true })
        .then((files) =>
          Promise.all(
            files
              .filter(
                (file) => file.isFile() && path.extname(file.name) === ".css"
              )
              .map((file) =>
                addFile(file.name, sourceDir, targetDir, targetFileName)
              )
          )
        )
    );
};

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

const readFileAsync = (filePath) => {
  let data = "";

  return new Promise((resolve, reject) => {
    const readStream = new fs.createReadStream(filePath);
    readStream.on("data", (chunk) => (data += chunk));
    readStream.on("end", () => resolve(data));
    readStream.on("error", (error) => reject(error));
  });
};

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
