const { isBlacklisted } = require("../services/securityService");

module.exports = async (req, res, next) => {
  if (await isBlacklisted(req.ip)) {
    return res.status(403).json({
      error: "IP temporarily blocked due to suspicious activity"
    });
  }
  next();
};