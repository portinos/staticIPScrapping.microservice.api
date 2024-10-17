const cron = require("node-cron");
const cache = require("../../services/cache.service");
const { walmartProducts } = require("./walmart-products");

const walmartProductsCron = cron.schedule(
  "30 * * * *",
  async () => {
    try {
      const dataStored = JSON.parse(
        await cache.get("static-ip-scrapping-microservice_walmart-products"),
      );
      if (dataStored.status === "in-process") return null;

      await cache.set(
        "static-ip-scrapping-microservice_walmart-products",
        JSON.stringify({
          name: "walmart",
          status: "in-process",
          last_update: new Date(),
          data: dataStored?.data || {},
          errors: dataStored?.errors || {},
        }),
      );

      const process = await walmartProducts();
      await cache.set(
        "static-ip-scrapping-microservice_walmart-products",
        JSON.stringify({
          name: "walmart",
          status: "finished",
          last_update: new Date(),
          data: process?.data || {},
          errors: process?.errors || {},
        }),
      );
    } catch (err) {
      console.log(err);
      await cache.set(
        "static-ip-scrapping-microservice_walmart-products",
        JSON.stringify({
          name: "walmart",
          status: "error",
          last_update: new Date(),
          data: {},
          errors: {},
        }),
      );
    }
  },
  {
    scheduled: false,
  },
);

module.exports = { walmartProductsCron };
