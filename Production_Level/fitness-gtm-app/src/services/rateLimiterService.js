const redis = require("../config/redis");

async function slidingWindow(key, limit, windowSec) {
  const now = Date.now();
  const windowStart = now - windowSec * 1000;

  await redis.zremrangebyscore(key, 0, windowStart);
  const count = await redis.zcard(key);

  if (count >= limit) {
    const ttl = await redis.ttl(key);
    return { allowed: false, remaining: 0, ttl };
  }

  await redis.zadd(key, now, now);
  await redis.expire(key, windowSec);

  return { allowed: true, remaining: limit - count - 1 };
}

module.exports = slidingWindow;