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
    # Security: Ensure only the product creator has access to admin stats
    admin_emails = ["rajdeep.pal2004@gmail.com", "rajdeep.pal2004@gmailcom"]
    if current_user.email.lower() not in admin_emails:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: User email '{current_user.email}' is not authorized."
        )

    # 1. Total registered users
    total_users = db.query(func.count(models.User.id)).scalar() or 0

    # 2. Total applications tracked
    total_applications = db.query(func.count(models.Application.id)).scalar() or 0

    # 3. Average applications per user
    avg_apps = round(total_applications / total_users, 1) if total_users > 0 else 0

    # 4. Signups over time (grouped by date, handling dialect mismatch)
    if db.bind.dialect.name == "postgresql":
        signups_query = db.query(
            func.to_char(models.User.created_at, 'YYYY-MM-DD').label('date'),
            func.count(models.User.id).label('count')
        ).group_by(func.to_char(models.User.created_at, 'YYYY-MM-DD')).order_by('date').all()
    else:
        signups_query = db.query(
            func.strftime('%Y-%m-%d', models.User.created_at).label('date'),
            func.count(models.User.id).label('count')
        ).group_by('date').order_by('date').all()

    # 4b. Telemetry Visits over time (grouped by date)
    if db.bind.dialect.name == "postgresql":
        visits_query = db.query(
            func.to_char(models.SiteVisit.created_at, 'YYYY-MM-DD').label('date'),
            func.count(models.SiteVisit.id).label('count')
        ).group_by(func.to_char(models.SiteVisit.created_at, 'YYYY-MM-DD')).order_by('date').all()
    else:
        visits_query = db.query(
            func.strftime('%Y-%m-%d', models.SiteVisit.created_at).label('date'),
            func.count(models.SiteVisit.id).label('count')
        ).group_by('date').order_by('date').all()

    # Merge signups and visits by date for the frontend chart
    timeline_dict = {}
    for r in signups_query:
        if r.date:
            timeline_dict.setdefault(r.date, {"date": r.date, "signups": 0, "visits": 0})["signups"] = r.count
    for r in visits_query:
        if r.date:
            timeline_dict.setdefault(r.date, {"date": r.date, "signups": 0, "visits": 0})["visits"] = r.count
    merged_timeline = sorted(timeline_dict.values(), key=lambda x: x["date"])

    # 5. List of all active users and their application count (explicit GROUP BY for Postgres)
    users_query = db.query(
        models.User.email,
        models.User.created_at,
        models.User.current_position,
        models.User.current_company,
        func.count(models.Application.id).label('apps_count')
    ).outerjoin(models.Application).group_by(
        models.User.id, models.User.email, models.User.created_at,
        models.User.current_position, models.User.current_company
    ).order_by(models.User.created_at.desc()).all()

    users_list = [
        {
            "email": r.email,
            "created_at": r.created_at.strftime('%Y-%m-%d %H:%M') if r.created_at else '',
            "apps_count": r.apps_count,
            "current_position": r.current_position or '',
            "current_company": r.current_company or ''
        } for r in users_query
    ]

    # Calculate user role classifications (Interns vs Employees)
    intern_count = 0
    employee_count = 0
    for u in users_list:
        pos = u["current_position"].strip().lower()
        if not pos:
            continue
        if "intern" in pos:
            intern_count += 1
        elif "student" in pos or "unemployed" in pos:
            continue
        else:
            employee_count += 1

    # Group users by employer / organization distribution
    company_stats_query = db.query(
        models.User.current_company,
        func.count(models.User.id).label('user_count')
    ).filter(
        models.User.current_company != None,
        models.User.current_company != ""
    ).group_by(
        models.User.current_company
    ).order_by(
        func.count(models.User.id).desc()
    ).all()

    company_distribution = [
        {
            "company": r.current_company,
            "user_count": r.user_count
        } for r in company_stats_query
    ]

    # 6. Telemetry traffic totals
    total_visits = db.query(func.count(models.SiteVisit.id)).scalar() or 0
    unique_visitors = db.query(func.count(func.distinct(models.SiteVisit.ip_address))).scalar() or 0
    conversion_rate = round((total_users / total_visits) * 100, 1) if total_visits > 0 else 0.0

    # 7. Premium Users
    premium_users_count = db.query(func.count(models.User.id)).filter(models.User.is_premium == True).scalar() or 0

    return {
        "total_users": total_users,
        "total_applications": total_applications,
        "avg_applications_per_user": avg_apps,
        "total_visits": total_visits,
        "unique_visitors": unique_visitors,
        "conversion_rate": conversion_rate,
        "intern_count": intern_count,
        "employee_count": employee_count,
        "company_distribution": company_distribution,
        "traffic_and_signups": merged_timeline,
        "users_list": users_list,
        "premium_users": premium_users_count
    }
