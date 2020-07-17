import { readdir, unlink, rename } from "fs";
import minimist from "minimist";
import { resolve } from "path";

async function main() {
  const args = minimist(process.argv.splice(2), {
    string: ["remhd"],
    boolean: ["del"],
  });

  const pattern = new RegExp(args._[0]);
  const matchedFiles = (await allFiles(process.cwd())).filter((filename) =>
    pattern.test(filename)
  );

  if (args.del) {
    deleteFiles(matchedFiles.map((filename) => resolve(filename)));
    console.log(
      `${matchedFiles.length} files matching pattern ${args._[0]} deleted.`
    );
  } else if (args.remhd) {
    renameFiles(matchedFiles, args.remhd, pattern);
    console.log(
      ` ${args._[0]} in ${matchedFiles.length} files changed to ${args.remhd}.`
    );
  } else if (matchedFiles.length > 0) {
    for (const file of matchedFiles) {
      console.log(file);
    }
  } else {
    console.log("No filename in directory matching pattern: " + args._[0])
  }
}

function allFiles(foldername: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readdir(foldername, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

function renameFiles(files: string[], replacer: string, pattern: RegExp) {
  for (const file of files) {
    const newName = resolve(file.replace(pattern, replacer));
    rename(resolve(file), newName, (err) => {
      if (err) console.error(err);
    });
  }
}

function deleteFiles(files: string[]) {
  for (const file of files) {
    unlink(file, (err) => {
      if (err) console.error(err);
    });
  }
}

main();
