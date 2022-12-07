/*
 *     Programmed by Z3NTL3 (Pix4)
 *     License: GNU
 *     Live On: z3ntl3.pix4.dev
 *
 *     Want to hire? Contact me on Telegram!
 *                  @z3ntl3
 *                t.me/z3ntl3
 */

// This file needs to be ran after any changes to the 'public' folder. To have the static content etc fully compressed in Brotli, has backbone if client does not support Brotli encoding thanks to fastify/static
const zlib = require("node:zlib");
const fs = require("node:fs");
const path = require("node:path");
const util = require("node:util");

var cleanPaths = [];
var readDirsOrFiles = util.promisify(fs.readdir);
var statS = util.promisify(fs.stat);

function retrieveAllFilesPlusDirs() {
  return new Promise(async (resolve) => {
    let base = path.join(__dirname, "../", "public");
    let tree = await readDirsOrFiles(base);

    for (var i = 0; i < tree.length; i++) {
      let absolute = path.join(base, tree[i]);
      let statIfy = await statS(absolute);

      if (statIfy.isDirectory()) {
        let getFilesFromDir = await readDirsOrFiles(absolute);
        for (var x = 0; x < getFilesFromDir.length; x++) {
          cleanPaths.push(path.join(absolute, getFilesFromDir[x]));
        }
        continue;
      }
      cleanPaths.push(absolute);
    }
    resolve(cleanPaths);
  });
}

class compressUtils {
  constructor(tree) {
    this.tree = tree;
    this.tree = this.tree.filter((f) => !String(f).endsWith(".br"));
  }
  async processCompress() {
    return new Promise((resolve) => {
      for (var i = 0; i < this.tree.length; i++) {
        let rStream = fs.createReadStream(this.tree[i]);
        let wStream = fs.createWriteStream(`${this.tree[i]}.br`, {
          flags: "w",
        });

        rStream.pipe(zlib.createBrotliCompress()).pipe(wStream);
      }
      resolve();
    });
  }
}

async function main() {
  let paths = await retrieveAllFilesPlusDirs();
  let utils = new compressUtils(paths);
  await utils.processCompress();
}
main();
