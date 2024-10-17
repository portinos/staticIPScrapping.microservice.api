const {
  walmartProductsCron,
} = require("../modules/walmart-products/walmart-product.cron");

// Execute crons
const executeCrons = () => {
  walmartProductsCron.start();
};

walmartProductsCron.start();

module.exports = { executeCrons };
