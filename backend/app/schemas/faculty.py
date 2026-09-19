from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import date, time
import uuid

class AssignedExamResponse(BaseModel):
    schedule_id: uuid.UUID
    batch_name: str
    case_id: uuid.UUID
    case_title: str
    category: str
    doctor_name: str
    patient_name: str
    patient_age: int
    patient_gender: str
    chief_complaint: str
    exam_date: date
    exam_time: time
    rig_location: str
    status: str
    student_count: int

    class Config:
        from_attributes = True

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
