# 🏋️ Fitness GTM App -- Production-Grade Rate Limiter Backend


✅ STEP 1: Create Project Folder
mkdir rate-limiter-app
cd rate-limiter-app
✅ STEP 2: Initialize Node Project
npm init -y
✅ STEP 3: Install Required Packages
npm install express ioredis dotenv
npm install --save-dev nodemon
npm run dev

## 📌 Project Overview

This project demonstrates a **production-level backend rate limiting
system** for a Fitness mobile application (GTM -- Go To Market
scenario).\
It includes multi-layer rate limiting, Redis-backed sliding window
control, JWT authentication, blacklisting, monitoring, and Dockerized
deployment.

------------------------------------------------------------------------

## 🎯 App Context

Assume we are launching a Fitness mobile app where users can:

-   Register
-   Login
-   Access Dashboard
-   Upload Workout Data
-   Sync periodically

The backend must handle: - Public internet traffic - Untrusted clients -
Potential abuse and brute-force attacks

------------------------------------------------------------------------

## 🏗 High-Level Architecture

Mobile App\
↓\
Load Balancer (Future Scaling)\
↓\
Node.js + Express (Stateless API)\
↓\
Multi-Layer Rate Limiter (Middleware)\
↓\
Redis (Centralized Rate Store)\
↓\
MongoDB (User Database)

------------------------------------------------------------------------

## 🛡 Multi-Layer Rate Limiting Strategy

### 1️⃣ Global IP Rate Limiter

-   100 requests per 15 minutes per IP\
-   Protects against bot traffic & scraping\
-   Redis Key: `rate:ip:<ip_address>`

### 2️⃣ Login Endpoint Limiter

-   5 login attempts per minute per IP\
-   Prevents brute-force attacks\
-   Redis Key: `rate:login:<ip_address>`

### 3️⃣ Authenticated User Limiter

-   300 requests per 15 minutes per user\
-   Prevents API abuse\
-   Redis Key: `rate:user:<user_id>`

------------------------------------------------------------------------

## ⚙ Algorithm Used -- Sliding Window

Why Sliding Window?

-   Prevents burst traffic at window edges
-   Fair request distribution
-   More accurate than fixed window
-   Suitable for mobile sync behavior

Implementation: - Redis Sorted Sets (ZADD, ZREM) - Timestamp-based
request tracking - TTL for automatic cleanup

------------------------------------------------------------------------

## 🚨 Security Enhancements

✔ Automatic violation tracking\
✔ Temporary IP blacklisting (after repeated abuse)\
✔ JWT authentication\
✔ Password hashing using bcrypt\
✔ Structured logging using Winston\
✔ Metrics tracking (total & blocked requests)

------------------------------------------------------------------------

## 📊 Monitoring & Metrics

Metrics stored in Redis:

-   `metric:total_requests`
-   `metric:blocked_requests`
-   `violation:<ip>`
-   `blacklist:<ip>`

Admin metrics endpoint available for monitoring system health.

------------------------------------------------------------------------

## 🐳 Dockerized Deployment

This project runs entirely via Docker.

### 🔧 Start Application

``` bash
docker-compose down -v
docker-compose up --build
```

### Services Started:

-   Node.js API (Port 3000)
-   MongoDB
-   Redis

------------------------------------------------------------------------

## 🧪 API Testing Guide

### Register

POST `/api/register`

``` json
{
  "username": "ragul",
  "email": "ragul@test.com",
  "password": "123456"
}
```

------------------------------------------------------------------------

### Login

POST `/api/login`

Returns JWT token.

------------------------------------------------------------------------

### Dashboard (Protected)

GET `/api/dashboard`

Header:

    Authorization: Bearer <token>

------------------------------------------------------------------------

## 🔥 Rate Limit Behavior

When exceeded:

HTTP 429

``` json
{
  "error": "Too many requests",
  "retryAfter": 60
}
```

After repeated violations:

HTTP 403

``` json
{
  "error": "IP temporarily blocked due to suspicious activity"
}
```

------------------------------------------------------------------------

## 📈 Scalability Plan

If traffic increases:

-   Scale API horizontally
-   Use Redis Cluster
-   Deploy MongoDB as managed service
-   Add Load Balancer (AWS ALB / Nginx)
-   Auto-scaling instances

Rate limiting remains consistent because Redis is centralized.

------------------------------------------------------------------------

## 🧠 Fail-Safe Design

If Redis fails: - System can be configured to fail-open (allow
traffic) - Logs error and triggers alert

------------------------------------------------------------------------

## 🚀 Production-Ready Features

✔ Stateless API\
✔ Centralized rate tracking\
✔ Distributed safe\
✔ Abuse detection\
✔ Docker reproducible environment\
✔ Clean layered architecture

------------------------------------------------------------------------

## 👨‍💻 Author

Developed as a backend system design demonstration for production-level
mobile app security and rate limiting.

------------------------------------------------------------------------

## 📌 License

MIT
