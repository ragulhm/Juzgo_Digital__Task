const slidingWindow = require("../services/rateLimiterService");
const { trackViolation } = require("../services/securityService");

module.exports = async (req, res, next) => {
  const key = `rate:ip:${req.ip}`;
  const result = await slidingWindow(key, 100, 900);

  if (!result.allowed) {
    await trackViolation(req.ip);
    return res.status(429).json({
      error: "Too many requests",
      retryAfter: result.ttl
    });
  }

  next();
};