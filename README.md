# 🗂️ Job Application Tracker

> A full-stack web application that automatically scrapes job listings, extracts key information using AI, and tracks your applications through the entire recruitment pipeline.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Accounts Required](#accounts-required)
- [Local Setup](#local-setup)
- [API Endpoints](#api-endpoints)
- [Application Statuses](#application-statuses)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [Future Features](#future-features)

---

## 🛠️ Tech Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Frontend         | React + Vite                            |
| Styling          | Tailwind CSS                            |
| Backend          | Python + FastAPI                        |
| Scraping         | Playwright                              |
| AI Extraction    | Claude API (`claude-sonnet-4-20250514`) |
| Database         | Supabase (PostgreSQL)                   |
| Frontend Hosting | Vercel                                  |
| Backend Hosting  | Render                                  |

---

## ✨ Features

- **Smart job import** — paste a URL and the app scrapes and extracts role, company, salary, requirements, deadline and more automatically
- **Application dashboard** — see all your applications at a glance with colour-coded statuses
- **Status tracking** — track every stage from Applied through to Offer or Rejected
- **Interview management** — log interview rounds, round notes, and upcoming interview dates
- **Search & filter** — filter by status, search by company or role, sort by date
- **Summary stats** — live counts of active applications, interviews this week, and offer rate

---

## 📁 Project Structure

```
job-tracker/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddJobModal.jsx       # URL input → scrape → preview → save flow
│   │   │   ├── ApplicationsTable.jsx # Main applications table with sorting
│   │   │   ├── EditDrawer.jsx        # Side panel to update status, notes, rounds
│   │   │   └── FilterBar.jsx         # Search, status filter, sort controls
│   │   ├── pages/
│   │   │   └── Dashboard.jsx         # Main page — stats + table
│   │   └── App.jsx
│   ├── .env.local                    # Frontend environment variables
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Python + FastAPI app
│   ├── main.py                # API entry point and route definitions
│   ├── scraper.py             # Playwright browser scraper
│   ├── extractor.py           # Claude AI extraction logic
│   ├── database.py            # Supabase client initialisation
│   ├── models.py              # Pydantic data models/schemas
│   └── requirements.txt
│
├── .env                       # Secret keys — ⚠️ never commit this
├── .gitignore
└── README.md
```

---

## ✅ Prerequisites

Make sure the following are installed on your machine before you begin:

- [Node.js v20+](https://nodejs.org) — includes `npm`
- [Python 3.11+](https://python.org)
- [Git](https://git-scm.com)

Verify your installations:

```bash
node --version    # Should print v20.x.x or higher
python --version  # Should print 3.11.x or higher
git --version     # Should print git version 2.x.x
```

---

## 🔑 Accounts Required

Create free accounts on the following platforms before setting up the project:

| Service       | Purpose                           | Link                                                   |
| ------------- | --------------------------------- | ------------------------------------------------------ |
| **Supabase**  | Hosted PostgreSQL database        | [supabase.com](https://supabase.com)                   |
| **Anthropic** | Claude AI API for data extraction | [console.anthropic.com](https://console.anthropic.com) |
| **GitHub**    | Version control                   | [github.com](https://github.com)                       |
| **Vercel**    | Frontend hosting                  | [vercel.com](https://vercel.com)                       |
| **Render**    | Backend hosting                   | [render.com](https://render.com)                       |

### Getting your API keys

**Supabase** — after creating a project, go to:
`Project Settings → API`

You need three values:

- `Project URL` — looks like `https://xyzabc.supabase.co`
- `anon / public key` — used in the frontend
- `service_role key` — used in the backend only, never expose this in frontend code

**Anthropic** — after creating an account, go to:
`API Keys → Create Key`

Copy it immediately — you cannot view it again. Keys start with `sk-ant-...`

> 💡 Add $5 USD credit to your Anthropic account to start. Each job extraction costs fractions of a cent.

---

## 🚀 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/job-tracker.git
cd job-tracker
```

---

### 2. Configure environment variables

Create a `.env` file in the **project root**:

```bash
# .env — never commit this file
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
FRONTEND_URL=http://localhost:5173
```

Create a `.env.local` file inside the `frontend/` folder:

```bash
# frontend/.env.local
VITE_API_URL=http://localhost:8000
```

Confirm both are in your `.gitignore` before your first push:

```bash
# .gitignore
.env
.env.local
__pycache__/
node_modules/
.DS_Store
```

---

### 3. Database setup (Supabase)

Log in to [Supabase](https://supabase.com) → open your project → navigate to **SQL Editor** and run:

```sql
CREATE TABLE applications (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   TIMESTAMPTZ DEFAULT NOW(),

  -- Scraped by AI
  url          TEXT NOT NULL,
  company      TEXT,
  role         TEXT,
  location     TEXT,
  salary       TEXT,
  work_type    TEXT,         -- e.g. Full-time, Part-time, Contract
  experience   TEXT,         -- e.g. '2+ years'
  deadline     DATE,
  description  TEXT,         -- AI-generated 3-sentence summary
  requirements TEXT[],       -- Array of top requirements/skills
  rating       NUMERIC(3,1), -- Rate how well your candidacy is based on resume

  -- Updated manually by you
  status       TEXT DEFAULT 'Applied',
  applied_date DATE DEFAULT NOW(),
  round        INTEGER DEFAULT 0,
  round_notes  TEXT,
  interview_at TIMESTAMPTZ,
  notes        TEXT,
  cover_letter TEXT,
  salary_asked TEXT
);
```

---

### 4. Backend setup

```bash
cd backend
pip install -r requirements.txt
playwright install chromium
```

Start the development server:

```bash
uvicorn main:app --reload --port 8000
```

The API is now live at `http://localhost:8000`.

> 💡 FastAPI auto-generates interactive docs at `http://localhost:8000/docs` — use this to test every endpoint before building the frontend.

---

### 5. Frontend setup

In a **separate terminal window**:

```bash
cd frontend
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

> ⚠️ Keep the backend running in your first terminal at the same time — otherwise all API calls from the frontend will fail.

---

## 📡 API Endpoints

| Method   | Endpoint                 | Description                                                   |
| -------- | ------------------------ | ------------------------------------------------------------- |
| `POST`   | `/api/scrape`            | Accepts a URL, scrapes it, returns extracted job data as JSON |
| `POST`   | `/api/applications`      | Saves a new application to the database                       |
| `GET`    | `/api/applications`      | Returns all applications sorted by date                       |
| `PATCH`  | `/api/applications/{id}` | Updates a single application (status, notes, etc.)            |
| `DELETE` | `/api/applications/{id}` | Deletes an application                                        |

### Example: scrape a job listing

**Request**

```bash
curl -X POST http://localhost:8000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/jobs/software-engineer"}'
```

**Response**

```json
{
  "company": "Acme Corp",
  "role": "Software Engineer",
  "location": "Sydney, NSW",
  "salary": "$90,000 – $110,000",
  "work_type": "Full-time",
  "experience": "2+ years",
  "deadline": "2026-04-01",
  "requirements": [
    "React or Vue experience",
    "REST API development",
    "SQL databases",
    "Git version control"
  ],
  "description": "Acme Corp is looking for a Software Engineer to join their growing platform team..."
}
```

---

## 🏷️ Application Statuses

| Status         | Meaning                             |
| -------------- | ----------------------------------- |
| `Applied`      | Submitted, waiting to hear back     |
| `Phone Screen` | Initial call scheduled or completed |
| `Interview`    | In active interview rounds          |
| `Offer`        | Received an offer                   |
| `Rejected`     | Application was unsuccessful        |
| `Withdrawn`    | You withdrew your application       |
| `Ghosted`      | No response after 2+ weeks          |

---

## 🌐 Deployment

### Backend → Render

1. Push your code to GitHub

2. Go to [Render](https://render.com) → **New** → **Web Service** → connect your repository

3. Configure the service:

   ```
   Root Directory:   backend
   Build Command:    pip install -r requirements.txt && playwright install chromium
   Start Command:    uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. Add environment variables under the **Environment** tab:

   ```
   ANTHROPIC_API_KEY     →  your Anthropic key
   SUPABASE_URL          →  your Supabase project URL
   SUPABASE_SERVICE_KEY  →  your Supabase service role key
   FRONTEND_URL          →  your Vercel URL (add after deploying frontend)
   ```

5. Deploy and note your live URL — e.g. `https://job-tracker-api.onrender.com`

> ⚠️ Render's free tier spins down after 15 minutes of inactivity. The first request after sleep takes ~30 seconds. This is normal for personal use.

---

### Frontend → Vercel

1. Go to [Vercel](https://vercel.com) → **Add New Project** → import your GitHub repository

2. Configure:

   ```
   Root Directory:    frontend
   Framework Preset:  Vite
   ```

3. Add environment variable:

   ```
   VITE_API_URL  →  https://job-tracker-api.onrender.com
   ```

4. Deploy — Vercel provides a live URL immediately (e.g. `https://job-tracker.vercel.app`)

5. Go back to Render and update `FRONTEND_URL` to your new Vercel URL

---

## ⚠️ Known Limitations

- **LinkedIn and Seek** detect headless browsers and may block scraping. Workaround: pass your logged-in browser cookies to Playwright, or paste the job description text directly as a fallback.
- **Render free tier** cold starts can be slow (~30s) after a period of inactivity.
- **Claude extraction** can occasionally return malformed JSON on very long or unusual page layouts — add a retry with error handling in `extractor.py`.

---

## 🔮 Future Features

- [ ] Email reminders before interview dates via Supabase Edge Functions + [Resend](https://resend.com)
- [ ] Google Calendar `.ics` export for interview slots
- [ ] Application funnel charts and weekly application stats
- [ ] One-click company research using Claude
- [ ] Browser extension to add jobs without leaving the listing page

---

## 📄 License

MIT
