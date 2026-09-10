from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

class SessionStartRequest(BaseModel):
    case_version_id: uuid.UUID
    primary_language: str = "en" # "en", "kn", "hi"

class SessionResponse(BaseModel):
    session_id: uuid.UUID
    case_version_id: uuid.UUID
    student_id: uuid.UUID
    session_status: str
    primary_language: str
    start_time: datetime
    current_state_name: Optional[str] = "INITIAL"
    current_vitals: Dict[str, Any]

    class Config:
        from_attributes = True

class ConversationTurnCreate(BaseModel):
    message: str
    language_code: Optional[str] = "en"

class ConversationTurnResponse(BaseModel):
    turn_id: uuid.UUID
    turn_index: int
    speaker: str
    language_code: str
    transcript: str
    audio_file_uri: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ActionCreateRequest(BaseModel):
    action_type: str # "EXAMINATION", "INVESTIGATION", "TREATMENT"
    action_identifier: str # e.g. "ecg_12_lead", "aspirin_300mg", "cardiovascular"
    details: Optional[Dict[str, Any]] = {}

class ActionResponse(BaseModel):
    action_id: uuid.UUID
    action_type: str
    action_identifier: str
    result_presented: Dict[str, Any]
    state_changed: bool = False
    new_state: Optional[str] = None
    vitals_updated: Dict[str, Any]
    action_timestamp: datetime

    class Config:
        from_attributes = True
