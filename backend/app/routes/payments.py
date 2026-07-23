import os
import stripe
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.routes.auth import get_current_user

router = APIRouter(prefix="/payments", tags=["payments"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_placeholder")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_placeholder")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID", "price_placeholder")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:4173")


@router.post("/create-checkout-session")
async def create_checkout_session(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Create a Stripe Checkout Session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price': STRIPE_PRICE_ID,
                    'quantity': 1,
                },
            ],
            mode='subscription', # Changed from 'payment' to 'subscription'
            success_url=f"{FRONTEND_URL}/premium?success=true",
            cancel_url=f"{FRONTEND_URL}/premium?canceled=true",
            client_reference_id=str(current_user.id),
            customer_email=current_user.email
        )
        return {"url": checkout_session.url}
    except Exception as e:
        print(f"Stripe Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not create checkout session.")


@router.post("/create-portal-session")
async def create_portal_session(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No active subscription found.")
    
    try:
        portal_session = stripe.billing_portal.Session.create(
            customer=current_user.stripe_customer_id,
            return_url=f"{FRONTEND_URL}/premium",
        )
        return {"url": portal_session.url}
    except Exception as e:
        print(f"Stripe Portal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not create customer portal session.")


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        # Verify webhook signature if secret is provided
        if STRIPE_WEBHOOK_SECRET and STRIPE_WEBHOOK_SECRET != "whsec_placeholder":
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        else:
            # Bypass verification for local testing without proper setup
            import json
            data = json.loads(payload)
            event = stripe.Event.construct_from(data, stripe.api_key)
            
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        user_id = session.get('client_reference_id')
        if user_id:
            user = db.query(User).filter(User.id == int(user_id)).first()
            if user:
                # Initially unlock for 6 months
                user.is_premium = True
                user.premium_expires_at = datetime.utcnow() + timedelta(days=183)
                user.stripe_customer_id = session.get('customer')
                user.stripe_session_id = session.get('subscription') # Store subscription ID instead of session ID for recurring
                db.commit()
                print(f"User {user.email} successfully upgraded to Premium!")

    return {"status": "success"}
