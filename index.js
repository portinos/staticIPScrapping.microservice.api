const express = require("express");
const cors = require("cors");

const { PORT, NODE_ENV } = require("./config/index");
const { executeCrons } = require("./src/cron-jobs");
const {
  walmartRouter,
} = require("./src/modules/walmart-products/walmart-products.routes");

const app = express();

// Cors
app.use(cors());
app.use("/", walmartRouter);
app.get("/", (req, res) => {
  res.send("This is scrapping with static IP API, By Portinos!");
});

app.listen(PORT, () => {
  console.log(
    `🚀  Server ready at http://localhost:${PORT} in ${NODE_ENV} mode`,
  );
  executeCrons();
});
