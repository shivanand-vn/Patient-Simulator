from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid

class PersonaSchema(BaseModel):
    patient_name: str
    age: int
    biological_sex: str
    emotional_baseline: str
    communication_style: str
    pain_level_baseline: int
    voice_config: Dict[str, Any]

    class Config:
        from_attributes = True

class CaseSummaryResponse(BaseModel):
    case_id: uuid.UUID
    case_version_id: uuid.UUID
    case_code: str
    title: str
    medical_specialty: str
    difficulty: str
    supported_languages: List[str]
    patient_name: str
    patient_age: int
    patient_sex: str
    chief_complaint: str

    class Config:
        from_attributes = True

class CaseDetailResponse(BaseModel):
    case_id: uuid.UUID
    case_version_id: uuid.UUID
    case_code: str
    title: str
    medical_specialty: str
    difficulty: str
    clinical_summary: str
    supported_languages: List[str]
    persona: PersonaSchema
    baseline_vitals: Dict[str, Any]
    examination_options: List[str]
    investigation_options: List[str]
    treatment_options: List[str]

    class Config:
        from_attributes = True
