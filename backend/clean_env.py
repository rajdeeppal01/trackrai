import os

env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_path):
    with open(env_path, 'rb') as f:
        raw = f.read()
    
    # Remove null bytes
    cleaned = raw.replace(b'\x00', b'')
    # Remove BOMs
    cleaned = cleaned.replace(b'\xff\xfe', b'').replace(b'\xfe\xff', b'')
    
    with open(env_path, 'wb') as f:
        f.write(cleaned)
    print("Cleaned .env file")
else:
    print(".env not found")
