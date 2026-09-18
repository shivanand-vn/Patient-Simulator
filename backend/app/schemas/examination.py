from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class StartAssessmentRequest(BaseModel):
    schedule_id: uuid.UUID
    student_id: str # e.g. BMC2026001

class PatientDemographics(BaseModel):
    patient_name: str
    age: int
    gender: str
    doctor_name: str
    chief_complaint: str

class AssessmentDetailResponse(BaseModel):
    assessment_id: uuid.UUID
    schedule_id: uuid.UUID
    student_id: str
    student_name: str
    is_backlog: bool
    patient: PatientDemographics
    predefined_assessment_order: List[Dict[str, Any]]
    target_vitals: Dict[str, Any]
    vital_reference_ranges: Dict[str, Any]
    status: str

    class Config:
        from_attributes = True

class RecordVitalsRequest(BaseModel):
    step_1_bp_sys: float
    step_1_bp_dia: float
    step_2_pulse: int
    step_3_spo2: int
    step_4_temp: float
    checklist: Dict[str, bool] = {} # seq_1 to seq_7
    faculty_feedback: Optional[str] = None

class VitalsScorecardResponse(BaseModel):
    assessment_id: uuid.UUID
    student_id: str
    sequence_score: float # max 50
    vitals_score: float   # max 50
    total_score: float    # max 100
    is_passed: bool
    breakdown: Dict[str, Any]
    recorded_at: datetime

    class Config:
        from_attributes = True
