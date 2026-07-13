import base64
import os
import secrets

def generate_key():
    """Generates a secure 32-byte url-safe base64 encoded key for Fernet."""
    key = base64.urlsafe_b64encode(secrets.token_bytes(32))
    print("\n--- TrackrAI Secure Encryption Key ---")
    print("Store this safely in your .env file as FERNET_KEY:\n")
    print(f"FERNET_KEY={key.decode('utf-8')}")
    print("\n----------------------------------------\n")

if __name__ == "__main__":
    generate_key()
