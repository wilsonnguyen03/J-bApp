from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class ScrapeRequest(BaseModel):
    url: str

class ApplicationCreate(BaseModel):
    url: str
    company: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    work_type: Optional[str] = None
    experience: Optional[str] = None
    deadline: Optional[date] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = []
    applied_date: Optional[date] = None
    notes: Optional[str] = None
    cover_letter: Optional[str] = None
    salary_asked: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    round: Optional[int] = None
    round_notes: Optional[str] = None
    interview_at: Optional[datetime] = None
    notes: Optional[str] = None
    cover_letter: Optional[str] = None
    salary_asked: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None