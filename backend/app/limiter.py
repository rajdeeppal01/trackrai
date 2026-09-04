from fastapi import Request
from slowapi import Limiter

def get_real_ip(request: Request) -> str:
    # Render guarantees the real client IP is appended to the right of X-Forwarded-For
    xff = request.headers.get("X-Forwarded-For")
    if xff:
        return xff.split(",")[-1].strip()
    return request.client.host if request.client else "127.0.0.1"

import os
from limits.storage import RedisStorage

# Fallback to in-memory DictStorage if REDIS_URL is not set
redis_url = os.getenv("REDIS_URL")
if redis_url:
    # Use Redis for distributed rate limiting across multiple workers/instances
    storage_backend = RedisStorage(redis_url)
    limiter = Limiter(key_func=get_real_ip, storage_uri=redis_url)
else:
    # In-memory rate limiting (per worker/instance)
    limiter = Limiter(key_func=get_real_ip)
