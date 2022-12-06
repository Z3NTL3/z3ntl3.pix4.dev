/*
 *     Programmed by Z3NTL3 (Pix4)
 *     License: GNU
 *     Link: z3ntl3.pix4.dev
 */
const qs = require("qs");
const app = require("fastify").default({
  ignoreTrailingSlash: true,
  ignoreDuplicateSlashes: true,
  caseSensitive: false,
  trustProxy: true,
  bodyLimit: 200000,
  querystringParser: (str) => qs.parse(str, { parameterLimit: 30 }),
});

const util = require("util");
require("dotenv").config();
const path = require("path");
const port = process.env.port;
const fs = require("node:fs");

var routes = [];

var Routes = (callback) => {
  let routesDir = path.join(__dirname, "routes");
  fs.readdir(routesDir, (err, files) => {
    if (err) return callback(err, null);
    for (var i = 0; i < files.length; i++) {
      routes.push(path.join(routesDir, files[i]));
    }
    return callback(err, routes);
  });
};
const getRoutes = util.promisify(Routes);

var Start = async () => {
  await getRoutes();

  await app.register(require("fast-compressor")); // -> https://github.com/Z3NTL3/fast-compressor or https://www.npmjs.com/package/fast-compressor
  await app.register(require("@fastify/compress"), {
    global: true,
    treshold: 200,
    inflateIfDeflated: true,
  });
  await app.register(require("@fastify/formbody"));

  app.addContentTypeParser(
    "*",
    { parseAs: "string" },
    function (request, payload, done) {
      try {
        done(null, JSON.stringify(payload));
      } catch (err) {
        done(err, null);
      }
    }
  );

  for (var i = 0; i < routes.length; i++) {
    await app.register(routes[i]);
  }
};
Start();
