const redis = require("../config/redis");

const loginLimiter = async (req, res, next) => {
  const ip = req.ip;
  const key = `rate_limit:login:${ip}`;
  const windowTime = 60; // 1 minute
  const maxRequests = 5;

  try {
    const current = await redis.get(key);

    if (current && parseInt(current) >= maxRequests) {
      return res.status(429).json({
        message: "Too many login attempts. Try again later."
      });
    }

    if (!current) {
      await redis.set(key, 1, "EX", windowTime);
    } else {
      await redis.incr(key);
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = loginLimiter;