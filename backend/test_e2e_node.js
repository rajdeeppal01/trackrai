const BASE_URL = "http://127.0.0.1:8000";

async function run() {
  console.log("1. Signup...");
  const email = "tester_ext2@example.com";
  let res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: "Password123!" })
  });
  if(res.status !== 201 && res.status !== 400) return console.log("Signup failed", await res.text());

  console.log("2. Login...");
  res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: "Password123!" })
  });
  const loginData = await res.json();
  const token = loginData.access_token;
  if(!token) return console.log("Login failed", loginData);

  console.log("3. Generate Ext Token...");
  res = await fetch(`${BASE_URL}/auth/extension-token`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const extData = await res.json();
  const extToken = extData.extension_token;
  if(!extToken) return console.log("Ext token failed", extData);
  console.log("Ext Token generated successfully!");

  console.log("4. Create Application via Ext Token...");
  res = await fetch(`${BASE_URL}/applications/`, {
    method: 'POST',
    headers: { 
        'Authorization': `Bearer ${extToken}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        company: "OpenAI",
        role: "AI Engineer",
        link: "https://openai.com",
        status: "Applied"
    })
  });
  if(res.status === 201) {
      console.log("SUCCESS! E2E Flow is working perfectly.");
  } else {
      console.log("App creation failed:", await res.text());
  }
}
run();
