from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import uuid

from app.core.database import get_db
from app.models.clinical import Case, CaseVersion, PatientPersona, ClinicalTruthModel, CaseStatus
from app.schemas.case import CaseSummaryResponse, CaseDetailResponse, PersonaSchema

router = APIRouter(prefix="/cases", tags=["Clinical Cases"])

@router.get("/", response_model=List[CaseSummaryResponse])
async def list_published_cases(db: AsyncSession = Depends(get_db)):
    """List all available clinical simulation cases for learners."""
    query = (
        select(CaseVersion)
        .options(
            selectinload(CaseVersion.case),
            selectinload(CaseVersion.persona),
            selectinload(CaseVersion.truth_model)
        )
        .where(CaseVersion.status == CaseStatus.PUBLISHED)
    )
    result = await db.execute(query)
    versions = result.scalars().all()

    response = []
    for cv in versions:
        if cv.case and cv.persona and cv.truth_model:
            response.append(CaseSummaryResponse(
                case_id=cv.case.case_id,
                case_version_id=cv.case_version_id,
                case_code=cv.case.case_code,
                title=cv.case.title,
                medical_specialty=cv.case.medical_specialty,
                difficulty=cv.case.difficulty.value,
                supported_languages=cv.supported_languages,
                patient_name=cv.persona.patient_name,
                patient_age=cv.persona.age,
                patient_sex=cv.persona.biological_sex,
                chief_complaint=cv.truth_model.chief_complaint
            ))
    return response

@router.get("/{case_version_id}", response_model=CaseDetailResponse)
async def get_case_details(case_version_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Fetches non-sensitive case details required to initialize student workspace."""
    query = (
        select(CaseVersion)
        .options(
            selectinload(CaseVersion.case),
            selectinload(CaseVersion.persona),
            selectinload(CaseVersion.truth_model)
        )
        .where(CaseVersion.case_version_id == case_version_id)
    )
    result = await db.execute(query)
    cv = result.scalar_one_or_none()

    if not cv or not cv.case or not cv.persona or not cv.truth_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case version not found")

    tm = cv.truth_model
    # Non-sensitive menus presented in Student UI
    examination_keys = list(tm.examination_catalog.keys()) if isinstance(tm.examination_catalog, dict) else []
    investigation_keys = list(tm.investigations_db.keys()) if isinstance(tm.investigations_db, dict) else []
    treatment_keys = list(tm.treatment_protocols.keys()) if isinstance(tm.treatment_protocols, dict) else []

    return CaseDetailResponse(
        case_id=cv.case.case_id,
        case_version_id=cv.case_version_id,
        case_code=cv.case.case_code,
        title=cv.case.title,
        medical_specialty=cv.case.medical_specialty,
        difficulty=cv.case.difficulty.value,
        clinical_summary=cv.clinical_summary,
        supported_languages=cv.supported_languages,
        persona=PersonaSchema(
            patient_name=cv.persona.patient_name,
            age=cv.persona.age,
            biological_sex=cv.persona.biological_sex,
            emotional_baseline=cv.persona.emotional_baseline,
            communication_style=cv.persona.communication_style,
            pain_level_baseline=cv.persona.pain_level_baseline,
            voice_config=cv.persona.voice_config
        ),
        baseline_vitals=tm.baseline_vitals,
        examination_options=examination_keys,
        investigation_options=investigation_keys,
        treatment_options=treatment_keys
    )
