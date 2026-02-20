const redis = require("../config/redis");

async function trackViolation(ip) {
  const key = `violation:${ip}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 3600);
  }

  if (count >= 10) {
    await redis.set(`blacklist:${ip}`, "true", "EX", 3600);
  }
}

async function isBlacklisted(ip) {
  const result = await redis.get(`blacklist:${ip}`);
  return result === "true";
}

module.exports = { trackViolation, isBlacklisted };