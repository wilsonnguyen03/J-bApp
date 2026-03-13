import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import ScrapeRequest, ApplicationCreate, ApplicationUpdate
from scraper import scrape_url
from extractor import extract_job_data
from database import supabase

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Scrape & extract a job listing ──────────────────────────────────────────

@app.post("/api/scrape")
async def scrape(request: ScrapeRequest):
    try:
        raw_text = await scrape_url(request.url)
        job_data = await extract_job_data(raw_text)
        job_data["url"] = request.url
        return job_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ── Save a new application ───────────────────────────────────────────────────

@app.post("/api/applications")
async def create_application(application: ApplicationCreate):
    try:
        data = application.model_dump()
        # Convert date objects to strings for Supabase
        if data.get("deadline"):
            data["deadline"] = str(data["deadline"])
        if data.get("applied_date"):
            data["applied_date"] = str(data["applied_date"])
        response = supabase.table("applications").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ── Get all applications ─────────────────────────────────────────────────────

@app.get("/api/applications")
async def get_applications():
    try:
        response = supabase.table("applications") \
            .select("*") \
            .order("created_at", desc=True) \
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ── Update an application ────────────────────────────────────────────────────

@app.patch("/api/applications/{id}")
async def update_application(id: str, updates: ApplicationUpdate):
    try:
        data = {k: v for k, v in updates.model_dump().items() if v is not None}
        if not data:
            raise HTTPException(status_code=400, detail="No fields to update")
        response = supabase.table("applications").update(data).eq("id", id).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ── Delete an application ────────────────────────────────────────────────────

@app.delete("/api/applications/{id}")
async def delete_application(id: str):
    try:
        supabase.table("applications").delete().eq("id", id).execute()
        return {"message": "Application deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))