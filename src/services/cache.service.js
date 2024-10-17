// cacheHelper.js
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = require("../../config");

const redis = require("redis");

const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});

exports.set = (key, value) => {
  return new Promise((resolve, reject) => {
    redisClient.set(key, value, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

exports.del = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

exports.get = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err || val == null) {
        if (err) reject(err);
        else resolve(false); // key is missing / not exists
      } else resolve(val);
    });
  });
};
