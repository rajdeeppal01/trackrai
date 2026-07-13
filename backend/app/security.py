import base64
import hashlib
import os
import warnings
from cryptography.fernet import Fernet
from app.routes.auth import SECRET_KEY

# Prefer a dedicated FERNET_KEY for encryption. Fallback to deriving from SECRET_KEY
_env_key = os.getenv("FERNET_KEY")

if _env_key:
    FERNET_KEY = _env_key.encode("utf-8")
else:
    warnings.warn("FERNET_KEY environment variable not found. Deriving encryption key from SECRET_KEY. This is not recommended for production.")
    _key_hash = hashlib.sha256(SECRET_KEY.encode()).digest()
    FERNET_KEY = base64.urlsafe_b64encode(_key_hash)

_cipher = Fernet(FERNET_KEY)

def encrypt_token(token: str) -> str:
    """Encrypts a string token using Fernet symmetric encryption."""
    if not token:
        return token
    return _cipher.encrypt(token.encode("utf-8")).decode("utf-8")

def decrypt_token(encrypted_token: str) -> str:
    """Decrypts a Fernet encrypted string token. Returns None if decryption fails."""
    if not encrypted_token:
        return encrypted_token
    try:
        return _cipher.decrypt(encrypted_token.encode("utf-8")).decode("utf-8")
    except Exception:
        # If decryption fails (e.g. old plaintext token, or key changed),
        # return None to force re-authentication.
        return None
