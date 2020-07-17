import { readdir } from 'fs';
import minimist from 'minimist';

async function main() {
    const args = minimist(process.argv.splice(2))
    const re = new RegExp(args.filer)
    const matchedFiles = (await allFiles(args.dir)).filter(filename => re.test(filename))
    console.log(matchedFiles)
}

function allFiles(foldername: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        readdir(foldername, (err, files) => {
            if (err) reject(err)
            else resolve(files)
        })
    })
}

main()