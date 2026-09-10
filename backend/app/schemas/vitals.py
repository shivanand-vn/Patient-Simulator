from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

class VitalsPayload(BaseModel):
    heart_rate: int
    bp_systolic: int
    bp_diastolic: int
    spo2_percent: int
    respiratory_rate: int
    temperature_c: float
    pain_score: int
    dynamic_payload: Optional[Dict[str, Any]] = {}

class VitalsLogResponse(BaseModel):
    vitals_log_id: uuid.UUID
    session_id: uuid.UUID
    recorded_at: datetime
    vitals: VitalsPayload

    class Config:
        from_attributes = True
