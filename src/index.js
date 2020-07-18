#!/usr/bin/env node

const fs = require("fs");
const minimist = require("minimist");
const path = require("path");

async function main() {
  const args = minimist(process.argv.splice(2), {
    string: ["remhd"],
    boolean: ["del"],
  });

  const pattern = new RegExp(args._[0]);
  const matchedFiles = (await allFiles(process.cwd()))
    .filter((filename) => pattern.test(filename))
    .filter((file) => fs.statSync(file).isFile());
    
  const fileCount = matchedFiles.length;
  const logEffect = () =>
    console.log(`${fileCount} file${fileCount > 1 ? "s" : ""} affected.`);

  if (fileCount == 0) {
    console.log("No filename in directory matching pattern: " + args._[0]);
  } else if (args.del) {
    deleteFiles(matchedFiles.map((filename) => path.resolve(filename)));
    logEffect();
  } else if (args.remhd) {
    renameFiles(matchedFiles, args.remhd, pattern);
    logEffect();
  } else {
    for (const file of matchedFiles) {
      console.log(file);
    }
  }
}

function allFiles(foldername) {
  return new Promise((resolve, reject) => {
    fs.readdir(foldername, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

function renameFiles(files, replacer, pattern) {
  for (const file of files) {
    const newName = path.resolve(file.replace(pattern, replacer));
    fs.rename(path.resolve(file), newName, (err) => {
      if (err) console.error(err);
    });
  }
}

function deleteFiles(files) {
  for (const file of files) {
    fs.unlink(file, (err) => {
      if (err) console.error(err);
    });
  }
}

main();
