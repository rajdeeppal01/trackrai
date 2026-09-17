import sys
import psycopg2

DATABASE_URL = "postgresql://neondb_owner:npg_msH2Uctkpq1K@ep-weathered-king-awfwwjtd-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require"

try:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    cur.execute("SELECT COUNT(*) FROM users")
    total_users = cur.fetchone()[0]
    print(f"Total Users: {total_users}")
    
    cur.execute("SELECT COUNT(*) FROM applications")
    total_apps = cur.fetchone()[0]
    print(f"Total Applications Tracked: {total_apps}")
    
    print("\nRecent Users:")
    cur.execute("SELECT email, created_at FROM users ORDER BY created_at DESC LIMIT 5")
    recent = cur.fetchall()
    for row in recent:
        print(f"- {row[0]} (Joined: {row[1]})")
        
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error querying database: {e}")
