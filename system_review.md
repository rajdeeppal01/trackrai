# TrackrAI: System Architecture & Security Review

This document provides a comprehensive analysis of the TrackrAI platform, written from two distinct engineering perspectives: a **Cybersecurity Engineer** reviewing system hardening, and a **Software Engineer** reviewing the technical architecture and feature implementations.

---

## Part 1: Cybersecurity Engineer Review

*Objective: Evaluate TrackrAI's threat model, data privacy safeguards, and vulnerability mitigations.*

### 1. Authentication & Identity Management
**How it works:** TrackrAI utilizes a standard OAuth2 Password Bearer flow for primary authentication, issuing JWTs (JSON Web Tokens) signed with `HS256`. Passwords are encrypted at rest using `bcrypt`.
**Why it works:** By adhering to standard JWT practices, the backend remains stateless while ensuring cryptographic proof of identity.
**Hardening Applied:** 
- The system enforces IDOR (Insecure Direct Object Reference) prevention at the database level. Every CRUD operation strictly filters by `user_id == current_user.id`, ensuring users can never query or modify cross-tenant data.

### 2. OAuth Security (Gmail Integration)
**How it works:** To connect a user's Gmail account, the system requests offline access from Google's OAuth 2.0 server. 
**Why it works:** This grants the backend a `refresh_token`, allowing background processes to request short-lived `access_tokens` without requiring the user to continuously re-authenticate.
**Hardening Applied (CSRF / Account Hijacking Prevention):**
- Implemented a PKCE-inspired Single-Page Application (SPA) flow. When initiating OAuth, the frontend generates a cryptographic `nonce` stored in `localStorage`. 
- The backend embeds this `nonce` into a signed JWT `state` parameter.
- Upon callback, the backend passes the `code` and `nonce` back to the frontend. The frontend strictly verifies the URL `nonce` against `localStorage`. This prevents an attacker from executing an OAuth CSRF attack to link a victim's Google account to the attacker's TrackrAI account.

### 3. Data Privacy & "Smart Sender Verification"
**How it works:** The platform scans emails to automatically update job statuses.
**Why it works:** To prevent the AI (Gemini) from ingesting sensitive personal data (e.g., bank statements, OTPs), the system relies on native Gmail API querying (`q` parameter). 
**Hardening Applied:**
- **Strict Query Filtering:** The system explicitly excludes emails containing words like `bank`, `invoice`, `password`, or `otp`. Sensitive emails are dropped by Google's servers and never reach TrackrAI's backend.
- **Anti-Spoofing:** The Gemini prompt includes a `CRITICAL SECURITY RULE` to cross-reference the sender's email domain with the extracted company name. If a malicious actor sends an email from a random domain to trigger a fake "Offer", the AI will reject it unless it originates from the company domain or a whitelisted Applicant Tracking System (ATS) like Greenhouse or Lever.

### 4. Application Layer Defense
**How it works:** Protection of API endpoints from abuse.
**Hardening Applied:**
- **Rate Limiting (Denial of Wallet Prevention):** Implemented `slowapi` at the FastAPI layer. Authentication endpoints are throttled to prevent brute-force attacks (5-10 req/min). AI-heavy endpoints (`/copilot/chat`) are throttled (10 req/min) to prevent automated scripts from draining the Gemini API billing quota.
- **Prompt Injection Defense:** AI prompts that ingest untrusted third-party data (email bodies) explicitly instruct the LLM to ignore meta-instructions (e.g., "Ignore all previous instructions"), preserving data integrity.
- **Error Sanitization:** Raw stack traces (`str(e)`) and raw downstream API responses are scrubbed from user-facing JSON to prevent infrastructure mapping.

---

## Part 2: Software Engineer Review

*Objective: Evaluate TrackrAI's architectural design, feature set, and integration of AI.*

### 1. Technology Stack
- **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion (for micro-animations).
- **Backend:** FastAPI (Python), SQLAlchemy (ORM), APScheduler (Background Tasks).
- **Database:** SQLite (local/dev) / PostgreSQL (production).
- **AI Integrations:** Google Gemini 1.5 Flash / 2.5 Flash.

### 2. Job Tracking Engine (CRUD Core)
**Feature:** A robust, responsive pipeline for managing the job hunt.
**How it works:** The frontend uses React Context (`ApplicationsContext.jsx`) and custom hooks (`useApplications.js`) to provide an optimistic UI. Applications are organized into Kanban-style boards or lists.
**Why it works:** Leveraging FastAPI and SQLAlchemy on the backend provides extremely low-latency JSON responses. Pydantic schemas validate all incoming data, ensuring the database remains clean.

### 3. Hands-Free Gmail Auto-Sync
**Feature:** Automatically updates application statuses (e.g., Applied -> Interview -> Rejected) without user intervention.
**How it works:** 
- The backend utilizes `APScheduler` to run a background cron job.
- For eligible premium users, it uses their Google `refresh_token` to get an active session.
- It queries the Gmail API for recent emails matching job keywords.
- The raw email body is stripped of HTML and passed to Gemini. Gemini returns a structured JSON payload extracting the `company_name` and `status_update`.
- A fuzzy string-matching algorithm in Python matches the extracted company name against the user's active database applications and updates the database row.
**Why it works:** By offloading the semantic extraction of the email to an LLM, the system avoids building complex, brittle Regex parsers that break whenever an employer changes their email formatting. 

### 4. AI Copilot (Context-Aware RAG)
**Feature:** A real-time career coach embedded in the dashboard.
**How it works:** When a user sends a message to `/copilot/chat`, the backend acts as a lightweight RAG (Retrieval-Augmented Generation) pipeline. It aggregates the user's:
1. Current Profile (Position, Bio)
2. Saved Resume Text
3. Entire job application pipeline (Company, Role, Status, Notes)
This data is injected into a strict `System Context` prompt before the user's message is sent to Gemini.
**Why it works:** Instead of giving generic ChatGPT-style advice, the Copilot can provide hyper-specific feedback (e.g., *"Your resume lacks frontend experience, which is why you were likely rejected for the React role at Stripe, but it looks great for the Backend role at Apple."*).

### 5. Smart Cold Emailer
**Feature:** Generates highly personalized outreach emails to recruiters or founders.
**How it works:** The user provides the recipient's role, company, and a desired tone (Casual, Direct, Creative, Professional). The backend merges this with the user's saved bio/resume and instructs Gemini 1.5 Flash to generate a structured JSON containing a `subject` and `body`.
**Why it works:** It uses an advanced Fallback Heuristics Engine. If the Gemini API is down, or the user's API key is missing, the backend seamlessly falls back to pre-written, highly optimized Python f-string templates that emulate the AI's behavior, ensuring the user always receives a high-quality email draft.

### 6. Automated Telemetry & Insights
**Feature:** Dashboard analytics and smart advice.
**How it works:** The system calculates metrics (response rate, missing links, follow-up alerts). For advanced insights, it passes the pipeline to Gemini to generate narrative advice. To ensure speed and save costs, the backend implements a caching layer (`cached_insights` and `insights_updated_at`), only regenerating AI insights when the user modifies their database.
