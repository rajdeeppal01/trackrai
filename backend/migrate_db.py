import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'trackrai.db')
conn = sqlite3.connect(db_path)
c = conn.cursor()
try:
    c.execute("ALTER TABLE users ADD COLUMN extension_token VARCHAR(100)")
    c.execute("CREATE UNIQUE INDEX ix_users_extension_token ON users (extension_token)")
    print("Column added successfully")
except Exception as e:
    print(f"Error: {e}")
conn.commit()
conn.close()
