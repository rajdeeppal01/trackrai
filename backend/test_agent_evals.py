import pytest
import os
import httpx
import json

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@pytest.mark.asyncio
async def test_insights_structured_output():
    """
    Eval 1: Verifies that the insights generation returns strictly valid JSON
    matching our schema without markdown blocks or hallucinations.
    """
    if not GEMINI_API_KEY:
        pytest.skip("GEMINI_API_KEY is required for eval tests.")
        
    prompt = "Generate exactly 2 generic job search insights. Follow strict JSON array format."
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    # Using responseSchema to enforce structured output
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "type": {"type": "STRING", "enum": ["stat", "tip", "warning", "success", "action"]},
                        "icon": {"type": "STRING"},
                        "title": {"type": "STRING"},
                        "body": {"type": "STRING"}
                    },
                    "required": ["type", "icon", "title", "body"]
                }
            }
        }
    }
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(url, headers=headers, json=payload)
        
    assert response.status_code == 200
    res_data = response.json()
    
    # Extract response
    text_response = res_data["candidates"][0]["content"]["parts"][0]["text"]
    
    # Evaluate valid JSON parsing (no markdown blocks like ```json)
    try:
        insights = json.loads(text_response)
    except json.JSONDecodeError:
        pytest.fail("Model returned invalid JSON or included markdown formatting.")
        
    # Evaluate structure
    assert isinstance(insights, list)
    assert len(insights) > 0
    
    for item in insights:
        assert "type" in item
        assert "icon" in item
        assert "title" in item
        assert "body" in item

@pytest.mark.asyncio
async def test_agent_tool_calling_escalation():
    """
    Eval 2: Tests if the agent correctly triggers the 'create_jira_ticket' tool
    when presented with a scenario requiring escalation (e.g. security issue).
    """
    if not GEMINI_API_KEY:
        pytest.skip("GEMINI_API_KEY is required for eval tests.")
        
    prompt = "I just found a critical vulnerability in my application's authentication flow. Please escalate this by creating a ticket for the engineering team."
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "tools": [
            {
                "functionDeclarations": [
                    {
                        "name": "create_jira_ticket",
                        "description": "Creates a Jira ticket for escalating issues, bugs, or security vulnerabilities to the engineering team.",
                        "parameters": {
                            "type": "OBJECT",
                            "properties": {
                                "title": {"type": "STRING", "description": "Short title of the issue"},
                                "description": {"type": "STRING", "description": "Detailed description of the problem"},
                                "priority": {"type": "STRING", "enum": ["Low", "Medium", "High", "Critical"]}
                            },
                            "required": ["title", "description", "priority"]
                        }
                    }
                ]
            }
        ]
    }
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(url, headers=headers, json=payload)
        
    assert response.status_code == 200
    res_data = response.json()
    
    parts = res_data["candidates"][0]["content"].get("parts", [])
    
    # Check if a function call was generated
    has_function_call = any("functionCall" in part for part in parts)
    
    assert has_function_call, "Agent failed to trigger the tool when explicitly asked to create a ticket."
    
    # Further validation of the function call arguments
    for part in parts:
        if "functionCall" in part:
            call = part["functionCall"]
            assert call["name"] == "create_jira_ticket"
            assert "priority" in call["args"]
            assert call["args"]["priority"] == "Critical" # It should infer it's critical
