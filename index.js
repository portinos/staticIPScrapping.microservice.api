const express = require("express");
const cors = require("cors");
const { executeCrons } = require("./src/cron-jobs");
const PORT = process.env.PORT || 3000;
const MODE = process.env.NODE_ENV || "production";
const app = express();
// Cors
app.use(cors());
app.get("/", (req, res) => {
  res.send("This is scrapping with static IP API, By Portinos!");
});

app.listen(PORT, () => {
  console.log(`🚀  Server ready at http://localhost:${PORT} in ${MODE} mode`);
  executeCrons();
});
