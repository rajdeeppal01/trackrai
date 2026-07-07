from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/telemetry",
    tags=["Telemetry"],
)

@router.post("/visit")
def log_visit(
    payload: schemas.TelemetryVisit,
    request: Request,
    db: Session = Depends(get_db),
):
    # Extract client IP (handle proxies like Cloudflare/Render/Vercel)
    ip_address = request.headers.get("x-forwarded-for")
    if ip_address:
        # Get the first IP in the forwarded list
        ip_address = ip_address.split(",")[0].strip()
    else:
        ip_address = request.client.host if request.client else "unknown"

    user_agent = request.headers.get("user-agent", "unknown")

    visit = models.SiteVisit(
        path=payload.path or "/",
        user_agent=user_agent[:500],  # cap length to avoid DB issues
        ip_address=ip_address[:100],
    )
    db.add(visit)
    db.commit()
    return {"status": "success"}
