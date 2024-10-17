if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  // Base config
  PORT: process.env.PORT || "3000",
  NODE_ENV: process.env.NODE_ENV || "development",
  REDIS_PORT: process.env.REDIS_PORT || "6379",
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",

  // Modules
  WALMART_DATA:
    process.env.WALMART_DATA ||
    "https://strapi.staging.portinos.com/v1/api/walmart/get_raw",
};
