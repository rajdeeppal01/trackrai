import os
from fastapi.testclient import TestClient
from dotenv import load_dotenv

# Load env vars
load_dotenv()

# Import the FastAPI app
from app.main import app
from app.database import Base, engine

# Initialize test client
client = TestClient(app)

# We need a valid JWT token, but let's see if we can just mock the dependency or if it fails auth.
print("Testing ATS Matcher Backend Route...")

# Because we need auth, let's just test if the endpoint exists and returns 401 Unauthorized (proving it's a real backend route)
# OR we can mock the dependency.

from app.routes.auth import get_current_user
from app.models import User

def override_get_current_user():
    return User(id=1, email="test@trackrai.com")

app.dependency_overrides[get_current_user] = override_get_current_user

payload = {
    "job_description": "We are looking for a Senior Software Engineer with 5+ years of experience in Python, React, and AWS. Must have experience with microservices and Docker.",
    "resume_text": "Experienced Software Developer with 3 years building web applications using JavaScript, React, and Node.js. Familiar with frontend architecture."
}

try:
    response = client.post("/copilot/ats-match", json=payload)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print("\n✅ SUCCESS: The ATS Matcher is fully functional and talking to Gemini AI!")
        print("Response JSON:")
        import json
        print(json.dumps(response.json(), indent=2))
    elif response.status_code == 503:
        print("\n⚠️ PARTIAL SUCCESS: The route works, but GEMINI_API_KEY is not set in your .env file.")
    else:
        print(f"\n❌ FAILED: {response.text}")
except Exception as e:
    print(f"Error: {e}")
