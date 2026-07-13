import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.database import SessionLocal
from app.models import User
from app.routes.gmail import process_gmail_sync_for_user

scheduler = AsyncIOScheduler()

async def run_automated_sync():
    """
    Background job to run every 12 hours.
    Scans the inbox for all premium users who have auto-sync enabled.
    """
    print("Starting automated background Gmail sync...")
    db = SessionLocal()
    try:
        # Only select premium users with sync enabled and a valid token
        eligible_users = db.query(User).filter(
            User.gmail_sync_enabled == True,
            User.google_refresh_token.isnot(None),
            User.is_premium == True
        ).all()

        print(f"Found {len(eligible_users)} eligible premium users for auto-sync.")

        sem = asyncio.Semaphore(10)

        async def _sync_user(u):
            async with sem:
                try:
                    print(f"Syncing inbox for user ID: {u.id}...")
                    await process_gmail_sync_for_user(db, u)
                    print(f"Successfully synced inbox for user ID: {u.id}.")
                except Exception as e:
                    print(f"Failed to sync inbox for user ID: {u.id} - {str(e)}")

        tasks = [_sync_user(u) for u in eligible_users]
        await asyncio.gather(*tasks)
                
    except Exception as e:
        print(f"Error in background sync job: {str(e)}")
    finally:
        db.close()
        print("Completed automated background Gmail sync.")

def start_scheduler():
    """
    Configures and starts the APScheduler.
    """
    if not scheduler.running:
        # Schedule the job to run every 12 hours
        scheduler.add_job(run_automated_sync, 'interval', hours=12, id='auto_gmail_sync', replace_existing=True)
        scheduler.start()
        print("Background scheduler started: Auto-sync job scheduled every 12 hours.")

def shutdown_scheduler():
    """
    Shuts down the APScheduler.
    """
    if scheduler.running:
        scheduler.shutdown()
        print("Background scheduler shut down.")
