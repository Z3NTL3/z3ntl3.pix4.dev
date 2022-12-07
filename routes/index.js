module.exports = function (fastify, opts, done) {
  fastify.get("/", async (req, res) => {
    let clientToken = new Error();

    if (clientToken instanceof Error) {
      let newToken = await fastify.getToken;

      if (newToken instanceof Error) {
        return res.send("Could not retrieve Paypal API token");
      }
      clientToken = await fastify.getClientToken;
    }
    return res.render("index", {
      CLIENT_TOKEN: clientToken,
      home: process.env.HOME,
    });
  });
  done();
};
