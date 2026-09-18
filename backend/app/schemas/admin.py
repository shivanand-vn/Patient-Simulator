from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import date, time, datetime
import uuid

# Faculty Management Schemas
class FacultyCreateRequest(BaseModel):
    name: str
    email: EmailStr
    contact_number: str
    default_password: str = "password123"
    specialty: Optional[str] = "General Clinical"

class FacultyResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    must_change_password: bool
    status: str = "Active"

    class Config:
        from_attributes = True

# Batch & Student Management Schemas
class BatchCreateRequest(BaseModel):
    batch_name: str
    academic_year: str
    clinical_track: Optional[str] = "MBBS General Clinical"
    capacity: int = 60

class BatchResponse(BaseModel):
    batch_id: uuid.UUID
    batch_name: str
    academic_year: str
    clinical_track: str
    capacity: int
    enrolled_count: int = 0
    backlog_count: int = 0
    status: str

    class Config:
        from_attributes = True

class StudentCreateRequest(BaseModel):
    student_id: str # e.g. BMC2026001
    name: str
    year_of_joining: int
    is_backlog: bool = False
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class StudentResponse(BaseModel):
    id: uuid.UUID
    student_id: str
    name: str
    batch_id: Optional[uuid.UUID] = None
    year_of_joining: int
    is_backlog: bool
    email: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True

# Case Management Schemas
class CaseCreateRequest(BaseModel):
    case_code: str
    title: str
    category: str # "Cardiology" | "Respiratory"
    doctor_name: str
    patient_name: str
    patient_age: int
    patient_gender: str
    chief_complaint: str
    difficulty: Optional[str] = "INTERMEDIATE"
    target_vitals: Optional[Dict[str, Any]] = None

class AdminCaseResponse(BaseModel):
    case_id: uuid.UUID
    case_code: str
    title: str
    category: str
    doctor_name: str
    patient_name: str
    patient_age: int
    patient_gender: str
    chief_complaint: str
    difficulty: str
    target_vitals: Dict[str, Any]

    class Config:
        from_attributes = True

# Exam Scheduling Schemas
class ExamScheduleCreateRequest(BaseModel):
    batch_id: uuid.UUID
    case_id: uuid.UUID
    faculty_id: uuid.UUID
    exam_date: date
    exam_time: time
    rig_location: Optional[str] = "Simulation Room 1"
    notes: Optional[str] = None

class ExamScheduleResponse(BaseModel):
    schedule_id: uuid.UUID
    batch_id: uuid.UUID
    batch_name: str
    case_id: uuid.UUID
    case_title: str
    case_category: str
    faculty_id: uuid.UUID
    faculty_name: str
    exam_date: date
    exam_time: time
    rig_location: str
    status: str
    student_count: int = 0

    class Config:
        from_attributes = True
