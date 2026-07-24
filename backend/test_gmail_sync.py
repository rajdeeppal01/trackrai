import os
os.environ["DATABASE_URL"] = "sqlite:///./trackrai.db"

import asyncio
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from app.routes.gmail import process_gmail_sync_for_user

async def run_test():
    db = SessionLocal()
    # Assuming user 1 is rajdeeppalwork
    user = db.query(models.User).filter(models.User.email.like('%rajdeeppal%')).first()
    if not user:
        user = db.query(models.User).first()
    
    if not user:
        print("No user found")
        return

    print(f"Testing for user: {user.email}")
    try:
        res = await process_gmail_sync_for_user(db, user)
        print("Success!")
        print(res)
    except Exception as e:
        print("Error encountered:")
        print(repr(e))
        if hasattr(e, 'detail'):
            print("Detail:", e.detail)

if __name__ == "__main__":
    import sys
    sys.path.append(r"c:\Users\rajde\OneDrive\Desktop\projects\trackrai\backend")
    from dotenv import load_dotenv
    load_dotenv(r"c:\Users\rajde\OneDrive\Desktop\projects\trackrai\backend\.env")
    asyncio.run(run_test())
