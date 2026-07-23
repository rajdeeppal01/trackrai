import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("Testing Backend E2E Flow...")
    
    # 1. Sign up a test user
    email = "test_ext@example.com"
    password = "password123"
    
    print(f"1. Signing up {email}...")
    res = requests.post(f"{BASE_URL}/auth/signup", json={"email": email, "password": password})
    if res.status_code == 201:
        print("   -> Success")
    elif res.status_code == 400 and "already registered" in res.text:
        print("   -> User already exists, proceeding to login")
    else:
        print("   -> Failed:", res.text)
        return

    # 2. Login
    print("2. Logging in...")
    res = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
    if res.status_code != 200:
        print("   -> Failed:", res.text)
        return
    token = res.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    print("   -> Success")

    # 3. Generate Extension Token
    print("3. Generating Extension Token...")
    res = requests.post(f"{BASE_URL}/auth/extension-token", headers=headers)
    if res.status_code != 200:
        print("   -> Failed:", res.text)
        return
    ext_token = res.json().get("extension_token")
    print(f"   -> Success. Token: {ext_token[:10]}...")

    # 4. Create Job Application using Extension Token
    print("4. Testing Chrome Extension Job Creation Flow...")
    ext_headers = {"Authorization": f"Bearer {ext_token}"}
    job_data = {
        "company": "OpenAI",
        "role": "AI Engineer",
        "link": "https://openai.com/careers",
        "status": "Applied"
    }
    res = requests.post(f"{BASE_URL}/applications/", json=job_data, headers=ext_headers)
    if res.status_code == 201:
        print("   -> Success! Application created via extension token.")
    else:
        print("   -> Failed:", res.text)
        return

    print("\nALL TESTS PASSED: Auth and Chrome Extension Token workflows are working correctly.")

if __name__ == "__main__":
    run_tests()
