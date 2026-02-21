# Fitness GTM App -- Replication Guide

## Requirements

-   Docker Desktop
-   Git (optional)

## Steps to Run

1.  Clone the repository.
2.  Navigate to project directory.
3.  Run:

```{=html}
<!-- -->
```
    docker-compose down -v
    docker-compose up --build

4.  Wait until:
    -   MongoDB connected
    -   Redis connected
    -   Server running

## API Testing

### Register

POST http://localhost:3000/api/register

### Login

POST http://localhost:3000/api/login

### Dashboard

GET http://localhost:3000/api/dashboard\
Header: Authorization: Bearer `<token>`{=html}

## Testing Rate Limiting

-   Exceed login attempts (5 per minute)
-   Exceed IP limit (100 per 15 minutes)
-   Observe HTTP 429 and 403 responses

## Verifying Redis

Run:

    docker exec -it <redis_container_id> redis-cli
    keys *

Observe rate, violation, blacklist, and metric keys.
