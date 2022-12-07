/*
 *     Programmed by Z3NTL3 (Pix4)
 *     License: GNU
 *     Live On: z3ntl3.pix4.dev
 *
 *     Want to hire? Contact me on Telegram!
 *                  @z3ntl3
 *                t.me/z3ntl3
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
const fp = require("fastify-plugin");
const util = require("util");
require("dotenv").config();
const path = require("path");
const fs = require("node:fs");
const axios = require("axios").default;
const BASE = process.env.BASE;
const CLIENT_ID = process.env.CLIENT_ID;
const SECRET = process.env.SECRET;
const PORT = process.env.port;
const updateDotenv = require("update-dotenv");
var ACCESS_TOKEN = "";

var routes = [];
const instanceStart = axios.create({
  baseURL: BASE,
  timeout: 5000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${SECRET}`).toString(
      "base64"
    )}`,
  },
});
const schemas = require(path.join(__dirname, "schemas", "schemas.js"));
app.addSchema(schemas.captureSchema);

const mainInstance = axios.create({
  baseURL: BASE,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

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

function getToken() {
  return new Promise(async (resolve) => {
    try {
      let req = await instanceStart.post(
        "/v1/oauth2/token",
        qs.stringify({ grant_type: "client_credentials" })
      );

      ACCESS_TOKEN = req.data.access_token;
      mainInstance.defaults.headers.post[
        "Authorization"
      ] = `Bearer ${ACCESS_TOKEN}`;
      return resolve(req.data.access_token);
    } catch (err) {
      return resolve(err);
    }
  });
}

function getClientToken() {
  return new Promise(async (resolve) => {
    try {
      let req = await mainInstance.post("/v1/identity/generate-token");
      resolve(req.data.client_token);
    } catch (err) {
      return resolve(err);
    }
  });
}

var Start = async () => {
  await getRoutes();
  await getToken();

  await app.register(
    fp((fastify, opts, done) => {
      fastify.decorate("getClientToken", getClientToken());
      fastify.decorate("getToken", getToken());
      done();
    })
  );
  await app.register(require("@fastify/static"), {
    root: path.join(__dirname, "public"),
    preCompressed: true,
  });
  await app.register(require("fast-compressor")); // -> https://github.com/Z3NTL3/fast-compressor or https://www.npmjs.com/package/fast-compressor
  await app.register(require("@fastify/compress"), {
    global: true,
    treshold: 200,
    inflateIfDeflated: true,
  });
  await app.register(require("@fastify/formbody"));
  await app.register(require("@fastify/view"), {
    engine: {
      ejs: require("ejs"),
    },
    root: path.join(__dirname, "public"),
    propertyName: "render",
  });
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
  app.setErrorHandler(async (err, req, res) => {
    console.log(err);
    res.send("Err");
  });

  for (var i = 0; i < routes.length; i++) {
    await app.register(require(routes[i]));
  }
  app.listen({ host: "localhost", port: PORT }, async (err, address) => {
    if (err) {
      console.log(err);
      process.exit(-1);
    }
    // Dynamically update .env HOME key instead of hard-code HOME
    await updateDotenv({
      HOME: `${address}`,
    });
    console.log(`Running at: ${address}`);
  });
};
Start();
