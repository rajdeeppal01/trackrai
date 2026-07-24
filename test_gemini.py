import os
import requests
import json
from dotenv import load_dotenv

load_dotenv(dotenv_path=r'c:\Users\rajde\OneDrive\Desktop\projects\trackrai\backend\.env')

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
headers = {"Content-Type": "application/json"}
prompt = "Test prompt"
payload = {
    "contents": [{"parts": [{"text": prompt}]}],
    "generationConfig": {
        "responseMimeType": "application/json",
        "responseSchema": {
            "type": "OBJECT",
            "properties": {
                "match_score": {"type": "INTEGER"},
                "missing_keywords": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"}
                },
                "improvement_tips": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"}
                }
            },
            "required": ["match_score", "missing_keywords", "improvement_tips"]
        }
    }
}

response = requests.post(url, headers=headers, json=payload)
print("Status:", response.status_code)
print("Response:", response.text)
