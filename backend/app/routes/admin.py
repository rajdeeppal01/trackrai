from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app import models, schemas
from app.database import get_db
from app.routes.auth import get_current_user

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Security: Ensure only the product creator (rajdeeppal01) has access to admin stats
    if not current_user.email.startswith("rajdeeppal01"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Admin credentials required."
        )

    # 1. Total registered users
    total_users = db.query(func.count(models.User.id)).scalar() or 0

    # 2. Total applications tracked
    total_applications = db.query(func.count(models.Application.id)).scalar() or 0

    # 3. Average applications per user
    avg_apps = round(total_applications / total_users, 1) if total_users > 0 else 0

    # 4. Signups over time (grouped by date)
    signups_query = db.query(
        func.strftime('%Y-%m-%d', models.User.created_at).label('date'),
        func.count(models.User.id).label('count')
    ).group_by('date').order_by('date').all()

    signups_list = [{"date": r.date, "count": r.count} for r in signups_query]

    # 5. List of all active users and their application count
    users_query = db.query(
        models.User.email,
        models.User.created_at,
        func.count(models.Application.id).label('apps_count')
    ).outerjoin(models.Application).group_by(models.User.id).order_by(models.User.created_at.desc()).all()

    users_list = [
        {
            "email": r.email,
            "created_at": r.created_at.strftime('%Y-%m-%d %H:%M'),
            "apps_count": r.apps_count
        } for r in users_query
    ]

    return {
        "total_users": total_users,
        "total_applications": total_applications,
        "avg_applications_per_user": avg_apps,
        "signups_over_time": signups_list,
        "users_list": users_list
    }
