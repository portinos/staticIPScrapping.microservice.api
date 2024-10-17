const { createClient } = require("redis");
const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_USERNAME,
} = require("../../config");

/**
 * Represents a Redis service for interacting with Redis.
 *
 * @class
 * @requires redis
 */
class Redis {
  /**
   * Create a RedisService instance.
   *
   * @constructor
   * @param {Object} options - The configuration options for the Redis client
   * @param {string} options.host - The Redis server hostname
   * @param {number} options.port - The Redis server port number
   * @param {string} [options.password] - The Redis server password (optional)
   * @param {string} [options.username] - The Redis server username (optional)
   */
  constructor({ host, port, password, username }) {
    this.redisClient = createClient({
      username,
      password,
      socket: {
        host,
        port,
      },
    });

    // Handle errors in the Redis client
    this.redisClient.on("error", (err) => {
      console.error("Redis client error:", err);
    });

    // Connect to Redis once when the instance is created
    this.redisClient.connect();
  }

  /**
   * Set the value of a key in the Redis database.
   *
   * @async
   * @param {string} key - The Redis key to set
   * @param {*} value - The value to set the key to
   * @returns {Promise<void>} - A promise that resolves when the operation completes
   * @throws {Error} If the Redis operation fails
   */
  async set(key, value) {
    await this.redisClient.set(key, value);
  }

  /**
   * Deletes the specified key from Redis.
   *
   * @async
   * @param {string} key - The key to delete from Redis
   * @returns {Promise<void>} - A promise that resolves when the key is deleted
   * @throws {Error} If the Redis operation fails
   */
  async del(key) {
    await this.redisClient.del(key);
  }

  /**
   * Retrieves the value associated with the specified key from Redis.
   *
   * @async
   * @param {string} key - The key to retrieve the value for
   * @returns {Promise<any>} - A promise that resolves to the value associated with the key, or null if the key does not exist
   * @throws {Error} If the Redis operation fails
   */
  async get(key) {
    const data = await this.redisClient.get(key);
    return data;
  }

  /**
   * Retrieves all the keys stored in Redis.
   *
   * @async
   * @returns {Promise<string[]>} - A promise that resolves to an array of keys
   * @throws {Error} If the Redis operation fails
   */
  async getAll() {
    const keys = await this.redisClient.keys("*");
    return keys;
  }

  /**
   * Close the connection to Redis.
   *
   * @async
   * @returns {Promise<void>} - A promise that resolves when the connection is closed
   */
  async close() {
    await this.redisClient.quit();
  }
}

module.exports = new Redis({
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
  port: REDIS_PORT,
  username: REDIS_USERNAME,
});
