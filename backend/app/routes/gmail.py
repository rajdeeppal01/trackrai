from datetime import datetime, timezone
import os
import json
import base64
from typing import Optional
import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.responses import RedirectResponse
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.routes.auth import get_current_user, SECRET_KEY, ALGORITHM

router = APIRouter(
    prefix="/gmail",
    tags=["Gmail Integration"],
)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "https://trackr-ai.vercel.app/settings?gmail_connected=true")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


def extract_body_text(payload) -> str:
    body = ""
    if "parts" in payload:
        for part in payload["parts"]:
            if part.get("mimeType") == "text/plain" and "data" in part.get("body", {}):
                try:
                    data = part["body"]["data"]
                    body += base64.urlsafe_b64decode(data.encode("utf-8")).decode("utf-8")
                except Exception:
                    pass
            elif "parts" in part:
                body += extract_body_text(part)
    elif "body" in payload and "data" in payload["body"]:
        try:
            data = payload["body"]["data"]
            body += base64.urlsafe_b64decode(data.encode("utf-8")).decode("utf-8")
        except Exception:
            pass
    return body or payload.get("snippet", "")


from fastapi import APIRouter, Depends, HTTPException, status, Request

@router.get("/auth-url")
def get_auth_url(token: str, request: Request):
    """
    Generate Google OAuth URL.
    We pass the user's JWT token in the 'state' parameter to identify them in the callback.
    """
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google OAuth client credentials are not configured on the server. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to the server environment."
        )
    
    # Dynamically build callback redirect based on backend host
    scheme = "https" if "localhost" not in request.url.netloc else "http"
    redirect_uri = f"{scheme}://{request.url.netloc}/gmail/callback"
    
    scope = "https://www.googleapis.com/auth/gmail.readonly"
    auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"response_type=code"
        f"&client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}"
        f"&scope={scope}"
        f"&access_type=offline"
        f"&prompt=consent"
        f"&state={token}"
    )
    return {"auth_url": auth_url}


@router.get("/callback")
async def oauth_callback(code: str, state: str, request: Request, db: Session = Depends(get_db)):
    """
    Handle Google OAuth callback redirect.
    """
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google Client ID or Secret is not configured."
        )

    # 1. Decode JWT state to identify the user
    import jwt as pyjwt_lib
    try:
        payload = pyjwt_lib.decode(state, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OAuth state parameter."
        )

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # 2. Exchange code for OAuth refresh/access tokens
    token_url = "https://oauth2.googleapis.com/token"
    scheme = "https" if "localhost" not in request.url.netloc else "http"
    redirect_uri = f"{scheme}://{request.url.netloc}/gmail/callback"
    
    payload = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    }

    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(token_url, data=payload)
            if res.status_code == 200:
                res_data = res.json()
                refresh_token = res_data.get("refresh_token")
                
                if refresh_token:
                    user.google_refresh_token = refresh_token
                    user.gmail_sync_enabled = True
                    db.commit()
                    # Redirect back to settings page
                    return RedirectResponse(url="https://trackr-ai.vercel.app/settings?gmail_connected=true")
                else:
                    # Google doesn't send refresh_token if the user has already authorized.
                    # We requested prompt=consent to avoid this, but fallback:
                    return RedirectResponse(url="https://trackr-ai.vercel.app/settings?error=consent_required")
            else:
                return RedirectResponse(url=f"https://trackr-ai.vercel.app/settings?error={res.text[:100]}")
    except Exception as e:
        return RedirectResponse(url=f"https://trackr-ai.vercel.app/settings?error={str(e)[:100]}")


@router.post("/toggle")
def toggle_gmail_sync(enabled: bool, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Enable or disable automated Gmail Sync.
    """
    if not current_user.google_refresh_token and enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please connect your Google account first."
        )
    current_user.gmail_sync_enabled = enabled
    db.commit()
    return {"gmail_sync_enabled": current_user.gmail_sync_enabled}


@router.post("/sync")
async def sync_gmail_inbox(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Manually trigger a Gmail sync and parse status changes with Gemini.
    """
    if not current_user.google_refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google Account is not connected. Please authenticate first."
        )

    # 1. Get fresh access token from Google
    token_url = "https://oauth2.googleapis.com/token"
    payload = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "refresh_token": current_user.google_refresh_token,
        "grant_type": "refresh_token"
    }

    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(token_url, data=payload)
            if res.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail=f"Google Token Refresh failed: {res.text}"
                )
            access_token = res.json().get("access_token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Google connection failed: {str(e)}")

    # 2. Fetch recent messages list from Gmail API
    # We query for keywords related to job updates
    query = "subject:(interview OR offer OR application OR update OR status OR assessment)"
    messages_url = "https://gmail.googleapis.com/gmail/v1/users/me/messages"
    headers = {"Authorization": f"Bearer {access_token}"}
    params = {"q": query, "maxResults": 10}

    messages = []
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(messages_url, headers=headers, params=params)
            if res.status_code == 200:
                messages = res.json().get("messages", [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Gmail list: {str(e)}")

    if not messages:
        return {"status": "success", "message": "No new job-related emails found.", "updated_applications": []}

    updated_applications = []
    
    # 3. Fetch details for each message
    async with httpx.AsyncClient(timeout=15.0) as client:
        for msg in messages:
            msg_id = msg["id"]
            detail_url = f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg_id}"
            detail_res = await client.get(detail_url, headers=headers)
            if detail_res.status_code != 200:
                continue
            
            detail_data = detail_res.json()
            headers_list = detail_data.get("payload", {}).get("headers", [])
            
            # Find subject and from address
            subject = ""
            sender = ""
            for h in headers_list:
                if h["name"].lower() == "subject":
                    subject = h["value"]
                elif h["name"].lower() == "from":
                    sender = h["value"]

            body_text = extract_body_text(detail_data.get("payload", {}))
            
            # Send details to Gemini for parsing
            if not GEMINI_API_KEY:
                continue

            gemini_url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            prompt = (
                "You are an automated email classifier for TrackrAI. "
                "Analyze the following email from a potential employer and classify the status change.\n\n"
                f"From: {sender}\n"
                f"Subject: {subject}\n"
                f"Body snippet:\n{body_text[:1500]}\n\n"
                "Return a JSON object containing exactly three keys:\n"
                '- "is_job_related": boolean (true if this is a job application, OA invite, interview invitation, offer, or rejection letter)\n'
                '- "company_name": string (the exact company name offering the role, or null if not related)\n'
                '- "status_update": string (strictly one of: "OA", "Interview", "Offer", "Rejected", or null if not clear or not related)\n\n'
                "Output MUST be valid JSON. Do not include markdown wraps or ticks."
            )

            g_payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"responseMimeType": "application/json"}
            }
            g_res = await client.post(gemini_url, json=g_payload, headers={"Content-Type": "application/json"})
            if g_res.status_code != 200:
                continue
            
            try:
                g_text = g_res.json()["candidates"][0]["content"]["parts"][0]["text"]
                analysis = json.loads(g_text.strip())
            except Exception:
                continue

            if not analysis.get("is_job_related") or not analysis.get("company_name") or not analysis.get("status_update"):
                continue

            company = analysis["company_name"].strip()
            new_status = analysis["status_update"].strip()

            # Find matching application in DB
            # Use case-insensitive search
            app = db.query(models.Application).filter(
                models.Application.user_id == current_user.id,
                func.lower(models.Application.company) == company.lower()
            ).first()

            if app and app.status != new_status:
                app.status = new_status
                db.commit()
                updated_applications.append({
                    "company": app.company,
                    "role": app.role,
                    "new_status": new_status
                })

    current_user.last_gmail_sync = datetime.now(timezone.utc)
    db.commit()

    return {
        "status": "success",
        "last_gmail_sync": current_user.last_gmail_sync.isoformat(),
        "updated_applications": updated_applications
    }
