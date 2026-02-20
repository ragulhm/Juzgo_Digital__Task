const express = require('express');
const Redis = require('ioredis');
require('dotenv').config();

const app = express();
const redis = new Redis(); // default localhost:6379

app.use(express.json());

// -------- RATE LIMITER MIDDLEWARE ----------
const rateLimiter = async (req, res, next) => {
  const ip = req.ip;
  const key = `rate_limit:${ip}`;
  const windowTime = 60; // seconds
  const maxRequests = 5;

  try {
    const current = await redis.get(key);

    if (current && parseInt(current) >= maxRequests) {
      return res.status(429).json({
        message: "Too many requests. Try again later."
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

// Use Rate Limiter
app.use(rateLimiter);

// Test Route
app.get('/', (req, res) => {
  res.send("API Working");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});