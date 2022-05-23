const { stdin, stdout } = process;
const fs = require("fs");
const path = require("path");
const output = fs.createWriteStream(path.join(__dirname, "text.txt"));

stdout.write("Write here!\n");

stdin.on("data", (data) => {
  if (process.on("SIGINT", () => process.exit()));
  if (data.toString() === "exit\r\n") process.exit();
  output.write(data);
});

process.on("exit", (item) => item === 0 ? stdout.write("Good bye!") : stdout.write("error" + item));
