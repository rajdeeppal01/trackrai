import os
import razorpay
import hmac
import hashlib
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db, SessionLocal
from app.models import User
from app.routes.auth import get_current_user

router = APIRouter(prefix="/payments", tags=["payments"])

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
RAZORPAY_AMOUNT = 49900  # amount in paise (e.g. ₹499.00)

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-razorpay-order")
async def create_razorpay_order(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        key_id = RAZORPAY_KEY_ID
        key_secret = RAZORPAY_KEY_SECRET
        
        client = razorpay.Client(auth=(key_id, key_secret))
        
        data = {
            "amount": RAZORPAY_AMOUNT,
            "currency": "INR",
            "receipt": f"receipt_{current_user.id}",
            "notes": {
                "email": current_user.email,
                "user_id": str(current_user.id)
            }
        }
        
        order = client.order.create(data=data)
        return {"id": order["id"], "amount": order["amount"], "currency": order["currency"], "key_id": key_id}
        
    except Exception as e:
        print(f"Razorpay Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-payment")
async def verify_payment(
    req: VerifyPaymentRequest,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        key_secret = RAZORPAY_KEY_SECRET
        
        # Verify signature manually
        msg = f"{req.razorpay_order_id}|{req.razorpay_payment_id}"
        generated_signature = hmac.new(
            key_secret.encode('utf-8'),
            msg.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature != req.razorpay_signature:
            raise HTTPException(status_code=400, detail="Invalid payment signature")
            
        # Upgrade user
        current_user.is_premium = True
        current_user.premium_expires_at = datetime.utcnow() + timedelta(days=183) # 6 months
        current_user.razorpay_order_id = req.razorpay_order_id
        current_user.razorpay_payment_id = req.razorpay_payment_id
        db.commit()
        
        print(f"User {current_user.email} successfully upgraded to Premium via Razorpay!")
        return {"status": "success", "message": "Premium activated"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Razorpay Verification Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")

def process_webhook_event(event: str, payload: dict):
    db = SessionLocal()
    try:
        if event == "order.paid":
            # order.paid triggered when payment is successful
            order_entity = payload.get("payload", {}).get("order", {}).get("entity", {})
            order_id = order_entity.get("id")
            
            # The user_id was passed in notes during order creation
            notes = order_entity.get("notes", {})
            user_id_str = notes.get("user_id")
            
            if user_id_str:
                user = db.query(User).filter(User.id == int(user_id_str)).first()
                # Idempotency Check: Don't process if we already processed this specific order
                if user and user.razorpay_order_id != order_id:
                    user.is_premium = True
                    user.premium_expires_at = datetime.utcnow() + timedelta(days=183) # 6 months
                    user.razorpay_order_id = order_id
                    db.commit()
                    print(f"User {user.email} successfully upgraded to Premium via Webhook async!")
    except Exception as e:
        print(f"Background Webhook Error: {str(e)}")
    finally:
        db.close()

@router.post("/webhook")
async def razorpay_webhook(request: Request, background_tasks: BackgroundTasks):
    try:
        body = await request.body()
        signature = request.headers.get("x-razorpay-signature")
        
        if not signature:
            raise HTTPException(status_code=400, detail="Missing signature")
            
        client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
        
        # Verify the webhook signature
        try:
            client.utility.verify_webhook_signature(body.decode("utf-8"), signature, RAZORPAY_WEBHOOK_SECRET)
        except razorpay.errors.SignatureVerificationError:
            print("Webhook signature verification failed.")
            raise HTTPException(status_code=400, detail="Invalid signature")

        payload = await request.json()
        event = payload.get("event")
        
        # Dispatch to background task to ensure fast 200 OK
        background_tasks.add_task(process_webhook_event, event, payload)
        
        return {"status": "ok"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Webhook Endpoint Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
