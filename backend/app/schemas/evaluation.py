from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class DiagnosisSubmission(BaseModel):
    primary_diagnosis: str
    differential_diagnoses: List[str] = []
    clinical_reasoning: Optional[str] = ""

class EvaluationResponse(BaseModel):
    evaluation_id: uuid.UUID
    session_id: uuid.UUID
    total_score: float
    is_passed: bool
    score_breakdown: Dict[str, float] # history, examination, investigation, treatment, diagnosis, communication
    critical_errors_hit: List[Dict[str, Any]]
    strengths: List[str]
    areas_for_growth: List[str]
    ideal_pathway: Dict[str, Any]
    completed_at: datetime

    class Config:
        from_attributes = True
