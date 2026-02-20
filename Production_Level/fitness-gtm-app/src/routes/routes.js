const express = require("express");
const { register, login, dashboard } = require("../controllers/authController");
const ipLimiter = require("../middlewares/ipLimiter");
const loginLimiter = require("../middlewares/loginLimiter");
const userLimiter = require("../middlewares/userLimiter");
const blacklistCheck = require("../middlewares/blacklistCheck");

const router = express.Router();

router.post("/register", blacklistCheck, ipLimiter, register);
router.post("/login", blacklistCheck, ipLimiter, loginLimiter, login);
router.get("/dashboard", blacklistCheck, ipLimiter, userLimiter, dashboard);

module.exports = router;