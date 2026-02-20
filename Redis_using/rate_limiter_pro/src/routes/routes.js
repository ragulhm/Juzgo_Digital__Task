const express = require("express");
const ipLimiter = require("../middlewares/ipLimiter");
const loginLimiter = require("../middlewares/loginLimiter");
const userLimiter = require("../middlewares/userLimiter");
const { login, dashboard } = require("../controllers/authController");

const router = express.Router();

router.post("/login", ipLimiter, loginLimiter, login);
router.get("/dashboard", ipLimiter, userLimiter, dashboard);

module.exports = router;