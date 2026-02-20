const redis = require("../config/redis");
const jwt = require("jsonwebtoken");

const userLimiter = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    const userId = decoded.id;

    const key = `rate_limit:user:${userId}`;
    const windowTime = 900; // 15 minutes
    const maxRequests = 300;

    const current = await redis.get(key);

    if (current && parseInt(current) >= maxRequests) {
      return res.status(429).json({
        message: "Too many requests from this user."
      });
    }

    if (!current) {
      await redis.set(key, 1, "EX", windowTime);
    } else {
      await redis.incr(key);
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = userLimiter;