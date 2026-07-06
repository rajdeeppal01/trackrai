from datetime import datetime, timezone, date
import os
import json
from typing import List, Optional
from pydantic import BaseModel
import httpx

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models, schemas
from app.database import get_db
from app.routes.auth import get_current_user

router = APIRouter(
    prefix="/copilot",
    tags=["Copilot"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []


# ─── Fallback Rules Engine ─────────────────────────────────────────

def run_fallback_engine(applications: List[models.Application]) -> List[dict]:
    if not applications:
        return [
            {
                "type": "tip",
                "icon": "💡",
                "title": "Get Started",
                "body": "Add your first job application to unlock smart insights about your search.",
            }
        ]

    insights = []
    total = len(applications)

    # 1. Monthly applications count
    this_month_apps = 0
    today = date.today()
    for app in applications:
        app_date = app.applied_date or app.created_at.date()
        if app_date.year == today.year and app_date.month == today.month:
            this_month_apps += 1

    if this_month_apps > 0:
        insights.append({
            "type": "stat",
            "icon": "📅",
            "title": "Applications This Month",
            "body": f"You've applied to {this_month_apps} companies this month. Keep it up!",
        })

    # 2. Missing links
    missing_links = sum(1 for app in applications if not app.link or not app.link.strip())
    if missing_links > 0:
        insights.append({
            "type": "warning",
            "icon": "🔗",
            "title": "Missing Job Links",
            "body": f"{missing_links} application{'s are' if missing_links > 1 else ' is'} missing links. Add them to revisit postings quickly.",
        })

    # 3. Active interviews
    interviews = sum(1 for app in applications if app.status in ["Interview", "HR"])
    if interviews > 0:
        insights.append({
            "type": "action",
            "icon": "🎯",
            "title": "Active Interviews",
            "body": f"You have {interviews} active interview{'s' if interviews > 1 else ''}. Prepare thoroughly!",
        })

    # 4. Response rate
    responded = sum(1 for app in applications if app.status in ["OA", "Interview", "HR", "Offer"])
    if responded > 0:
        rate = int((responded / total) * 100)
        insights.append({
            "type": "success" if rate >= 20 else "stat",
            "icon": "📬",
            "title": f"Response Rate: {rate}%",
            "body": f"{responded} out of {total} applications received a response.",
        })

    # 5. Follow-ups
    need_follow_up = 0
    for app in applications:
        if app.status == "Applied":
            app_date = app.applied_date or app.created_at.date()
            days = (today - app_date).days
            if days >= 7:
                need_follow_up += 1

    if need_follow_up > 0:
        insights.append({
            "type": "warning",
            "icon": "⏰",
            "title": "Follow-Up Needed",
            "body": f"{need_follow_up} application{'s' if need_follow_up > 1 else ''} pending for 7+ days. Consider messaging recruiters.",
        })

    return insights[:5]


# ─── Gemini API Invoker ───────────────────────────────────────────

async def generate_gemini_insights(applications: List[models.Application]) -> List[dict]:
    if not GEMINI_API_KEY:
        # Fallback to local heuristic engine
        return run_fallback_engine(applications)

    # Format the data for Gemini
    apps_data = []
    for app in applications:
        apps_data.append({
            "company": app.company,
            "role": app.role,
            "status": app.status,
            "applied_date": str(app.applied_date) if app.applied_date else str(app.created_at.date()),
            "notes": app.notes or ""
        })

    prompt = (
        "You are an expert career coach and recruiter. Analyze the user's job application pipeline and generate a JSON list of exactly 3 to 5 smart, highly personalized insights.\n"
        "Do not offer generic advice. Look at the specific roles, companies, status ratios, and notes.\n"
        "Your output must be a valid JSON array of objects. Do not wrap in markdown or blockticks.\n"
        "Each object in the array must contain:\n"
        '- "type": exactly one of "stat", "tip", "warning", "success", "action"\n'
        '- "icon": one relevant emoji representing the tip\n'
        '- "title": a short 3-6 word bold title\n'
        '- "body": a detailed, direct sentence offering analysis or concrete next action.\n\n'
        f"Applications Pipeline:\n{json.dumps(apps_data, indent=2)}"
    )

    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            if response.status_code == 200:
                res_data = response.json()
                text_response = res_data["candidates"][0]["content"]["parts"][0]["text"]
                insights = json.loads(text_response.strip())
                if isinstance(insights, list):
                    return insights
            # Fallback on errors
            return run_fallback_engine(applications)
    except Exception:
        return run_fallback_engine(applications)


# ─── Routes ────────────────────────────────────────────────────────

@router.get("/insights")
async def get_insights(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Fetch all applications
    applications = db.query(models.Application).filter(models.Application.user_id == current_user.id).all()
    
    if not applications:
        return run_fallback_engine([])

    # Get maximum application updated timestamp
    latest_app = db.query(models.Application).filter(
        models.Application.user_id == current_user.id
    ).order_by(models.Application.updated_at.desc()).first()

    # Determine if cache is valid
    is_cache_valid = False
    if current_user.cached_insights and current_user.insights_updated_at:
        # Convert insights_updated_at to naive or match timezones
        cache_time = current_user.insights_updated_at
        app_time = latest_app.updated_at
        
        # Ensure timezone comparison compatibility
        if cache_time.tzinfo is not None and app_time.tzinfo is None:
            app_time = app_time.replace(tzinfo=timezone.utc)
        elif cache_time.tzinfo is None and app_time.tzinfo is not None:
            cache_time = cache_time.replace(tzinfo=timezone.utc)
            
        if cache_time >= app_time:
            is_cache_valid = True

    if is_cache_valid:
        try:
            return json.loads(current_user.cached_insights)
        except Exception:
            pass

    # Cache is stale or empty, generate fresh insights
    insights = await generate_gemini_insights(applications)
    
    # Save cache
    current_user.cached_insights = json.dumps(insights)
    current_user.insights_updated_at = datetime.now(timezone.utc)
    db.commit()
    
    return insights


@router.post("/chat")
async def copilot_chat(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not GEMINI_API_KEY:
        return {
            "reply": "I am currently running in Offline Heuristics Mode because the developer's Gemini API Key is not set in the server environment. Please set the GEMINI_API_KEY in the backend `.env` file."
        }

    # Fetch user applications for context
    applications = db.query(models.Application).filter(models.Application.user_id == current_user.id).all()
    apps_summary = []
    for app in applications:
        apps_summary.append(f"- {app.company}: {app.role} (Status: {app.status})")
    
    apps_str = "\n".join(apps_summary) if apps_summary else "No applications added yet."

    system_instruction = (
        "You are TrackrAI, an expert AI job search copilot. You have access to the user's job application pipeline. "
        "Your task is to answer user questions, help them prepare for interviews, give resume feedback, and suggest next actions. "
        "Keep your answers concise, structured, and action-oriented. Feel free to use markdown format.\n\n"
        f"User's Current Applications:\n{apps_str}"
    )

    # Format history and prompt for Gemini
    contents = []
    
    # Prepend context as a system instruction or starting user message
    contents.append({
        "role": "user",
        "parts": [{"text": f"System Context: Use the following application data to guide your future answers. Do not repeat this context unless asked.\n{system_instruction}"}]
    })
    contents.append({
        "role": "model",
        "parts": [{"text": "Understood. I will act as the TrackrAI job copilot and use this pipeline data to assist the user."}]
    })

    # Add chat history
    for msg in req.history:
        role = "user" if msg.get("role") == "user" else "model"
        contents.append({
            "role": role,
            "parts": [{"text": msg.get("content", "")}]
        })

    # Add the current message
    contents.append({
        "role": "user",
        "parts": [{"text": req.message}]
    })

    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": contents
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            if response.status_code == 200:
                res_data = response.json()
                reply = res_data["candidates"][0]["content"]["parts"][0]["text"]
                return {"reply": reply}
            else:
                return {"reply": f"Sorry, Gemini API returned error: {response.text}"}
    except Exception as e:
        return {"reply": f"Sorry, I encountered an error when communicating with Gemini: {str(e)}"}
