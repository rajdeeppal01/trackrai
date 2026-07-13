from fastapi import Request
from slowapi import Limiter

def get_real_ip(request: Request) -> str:
    # Render guarantees the real client IP is appended to the right of X-Forwarded-For
    xff = request.headers.get("X-Forwarded-For")
    if xff:
        return xff.split(",")[-1].strip()
    return request.client.host if request.client else "127.0.0.1"

limiter = Limiter(key_func=get_real_ip)
