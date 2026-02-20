const slidingWindow = require("../services/rateLimiterService");
const { trackViolation } = require("../services/securityService");

module.exports = async (req, res, next) => {
  const key = `rate:login:${req.ip}`;
  const result = await slidingWindow(key, 5, 60);

  if (!result.allowed) {
    await trackViolation(req.ip);
    return res.status(429).json({
      error: "Too many login attempts",
      retryAfter: result.ttl
    });
  }

  next();
};