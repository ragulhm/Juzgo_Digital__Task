const redis = require("../config/redis");

async function incrementMetric(name) {
  await redis.incr(`metric:${name}`);
}

async function getMetric(name) {
  return await redis.get(`metric:${name}`);
}

module.exports = { incrementMetric, getMetric };