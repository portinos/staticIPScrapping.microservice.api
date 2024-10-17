const fetch = require("node-fetch-commonjs");

async function fetchWithTimeout(resource, options = {}) {
  const timeout = 60000;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);

    if (error.code === "ECONNABORTED" || error.message === "canceled") {
      throw new Error(`Request to ${resource} timed out after ${timeout} ms`);
    } else if (error.response) {
      return error.response;
    }

    throw error;
  }
}

module.exports = { fetchWithTimeout };
