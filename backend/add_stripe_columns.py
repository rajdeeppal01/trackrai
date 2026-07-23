import sqlite3

def upgrade_db():
    conn = sqlite3.connect('trackrai.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(200)")
    except sqlite3.OperationalError as e:
        print(f"stripe_customer_id: {e}")
        
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN stripe_session_id VARCHAR(200)")
    except sqlite3.OperationalError as e:
        print(f"stripe_session_id: {e}")
        
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN premium_expires_at DATETIME")
    except sqlite3.OperationalError as e:
        print(f"premium_expires_at: {e}")

    conn.commit()
    conn.close()
    print("Database upgraded successfully.")

if __name__ == '__main__':
    upgrade_db()
