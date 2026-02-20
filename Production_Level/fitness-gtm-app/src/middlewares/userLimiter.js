const jwt = require("jsonwebtoken");
const slidingWindow = require("../services/rateLimiterService");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const key = `rate:user:${decoded.id}`;

    const result = await slidingWindow(key, 300, 900);

    if (!result.allowed) {
      return res.status(429).json({
        error: "User rate limit exceeded",
        retryAfter: result.ttl
      });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};