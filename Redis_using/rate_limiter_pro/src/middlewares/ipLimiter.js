const redis = require("../config/redis");

const ipLimiter = async (req, res, next) => {
  const ip = req.ip;
  const key = `rate_limit:ip:${ip}`;
  const windowTime = 900; // 15 minutes
  const maxRequests = 100;

  try {
    const current = await redis.get(key);
    const currentCount = current ? parseInt(current) : 0;

    if (currentCount >= maxRequests) {
      const ttl = await redis.ttl(key);

      res.set({
        "X-RateLimit-Limit": maxRequests,
        "X-RateLimit-Remaining": 0,
        "X-RateLimit-Reset": ttl
      });

      return res.status(429).json({
        message: "Too many requests from this IP."
      });
    }

    if (!current) {
      await redis.set(key, 1, "EX", windowTime);
    } else {
      await redis.incr(key);
    }

    // set rate-limit headers
    const ttl = await redis.ttl(key);
    res.set({
      "X-RateLimit-Limit": maxRequests,
      "X-RateLimit-Remaining": Math.max(0, maxRequests - currentCount),
      "X-RateLimit-Reset": ttl > 0 ? ttl : windowTime
    });

    next();
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = ipLimiter;