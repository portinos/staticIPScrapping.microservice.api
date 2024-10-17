const { Router } = require("express");
const cache = require("../../services/cache.service");

const walmartRouter = new Router();
walmartRouter.get("/api/v1/walmart-products", async (_, res) => {
  try {
    const data = await cache.get(
      "static-ip-scrapping-microservice_walmart-products",
    );

    if (!data)
      return res.json({
        name: "walmart",
        status: "in-process",
        last_update: new Date(),
        data: {},
        errors: {},
      });

    return res.json(JSON.parse(data));
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = { walmartRouter };
