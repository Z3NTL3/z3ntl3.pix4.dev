module.exports = function (fastify, opts, done) {
  fastify.get("/", async (req, res) => {
    let clientToken = await fastify.getClientToken;
    let id = await fastify.ID;

    if (clientToken instanceof Error) {
      let newToken = await fastify.getToken;

      if (newToken instanceof Error) {
        res.header("Content-Type", "application/json");

        let { data, encoding, success } = await fastify.fastRESTcomp(
          req.headers["accept-encoding"],
          JSON.stringify(
            { msg: "Could not get Paypal API creditentials try later..." },
            null,
            4
          )
        );

        if (encoding !== null) {
          res.header("Content-Encoding", encoding);
        }

        if (success !== null) {
          return res.send(data);
        }
        return res.send(
          JSON.stringify(
            { msg: "Could not get Paypal API creditentials try later..." },
            null,
            4
          )
        );
      }
      clientToken = await fastify.getClientToken;
    }
    return res.render("index", {
      CLIENT_TOKEN: clientToken,
      home: fastify.HOME,
      ID: id,
    });
  });
  done();
};
