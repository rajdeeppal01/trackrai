import os
import razorpay
import hmac
import hashlib
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.routes.auth import get_current_user

router = APIRouter(prefix="/payments", tags=["payments"])

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_TVFTzjryjPyA1L")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "AI2I1dBRUFGCmLStcsySro5b")
RAZORPAY_AMOUNT = 49900  # amount in paise (e.g. ₹499.00)

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-razorpay-order")
async def create_razorpay_order(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        key_id = os.getenv("RAZORPAY_KEY_ID", RAZORPAY_KEY_ID)
        key_secret = os.getenv("RAZORPAY_KEY_SECRET", RAZORPAY_KEY_SECRET)
        
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
        key_secret = os.getenv("RAZORPAY_KEY_SECRET", RAZORPAY_KEY_SECRET)
        
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
