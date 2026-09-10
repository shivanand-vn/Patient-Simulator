from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Dict, Any
import uuid

from app.core.database import get_db
from app.models.simulation import SimulationSession, ConversationTurn, SessionStatus, SessionVitalsLog
from app.models.clinical import CaseVersion, ScenarioState
from app.models.tenant import User
from app.schemas.session import (
    SessionStartRequest, 
    SessionResponse, 
    ConversationTurnCreate, 
    ConversationTurnResponse
)
from app.services.orchestrator.llm_orchestrator import AIPatientOrchestrator
from app.core.ws_manager import ws_manager

router = APIRouter(prefix="/sessions", tags=["Simulation Sessions"])

@router.post("/start", response_model=SessionResponse)
async def start_session(req: SessionStartRequest, db: AsyncSession = Depends(get_db)):
    """Initializes a new clinical simulation session for a student."""
    # Fetch case version
    cv_query = (
        select(CaseVersion)
        .options(selectinload(CaseVersion.truth_model), selectinload(CaseVersion.states))
        .where(CaseVersion.case_version_id == req.case_version_id)
    )
    cv_res = await db.execute(cv_query)
    cv = cv_res.scalar_one_or_none()
    if not cv or not cv.truth_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case version not found")

    # Find initial scenario state
    initial_state = next((s for s in cv.states if s.state_name == "INITIAL"), None)
    initial_state_id = initial_state.state_id if initial_state else None

    # Fetch a default student user for simulation (or use auth context)
    user_query = select(User).limit(1)
    user_res = await db.execute(user_query)
    student = user_res.scalar_one_or_none()
    student_id = student.user_id if student else uuid.uuid4()
    institution_id = student.institution_id if student else uuid.uuid4()

    baseline_vitals = cv.truth_model.baseline_vitals

    # Create session record
    session = SimulationSession(
        session_id=uuid.uuid4(),
        institution_id=institution_id,
        student_id=student_id,
        case_version_id=req.case_version_id,
        session_status=SessionStatus.ACTIVE,
        current_state_id=initial_state_id,
        primary_language=req.primary_language,
        session_metadata={"current_vitals": baseline_vitals}
    )
    db.add(session)
    await db.flush()

    return SessionResponse(
        session_id=session.session_id,
        case_version_id=session.case_version_id,
        student_id=session.student_id,
        session_status=session.session_status.value,
        primary_language=session.primary_language,
        start_time=session.start_time,
        current_state_name="INITIAL",
        current_vitals=baseline_vitals
    )

@router.post("/{session_id}/converse", response_model=ConversationTurnResponse)
async def converse(
    session_id: uuid.UUID, 
    turn_in: ConversationTurnCreate, 
    db: AsyncSession = Depends(get_db)
):
    """Processes a student conversation turn and returns the AI patient's response."""
    # 1. Fetch session and clinical truth
    s_query = (
        select(SimulationSession)
        .options(
            selectinload(SimulationSession.actions)
        )
        .where(SimulationSession.session_id == session_id)
    )
    s_res = await db.execute(s_query)
    session = s_res.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    cv_query = (
        select(CaseVersion)
        .options(
            selectinload(CaseVersion.persona),
            selectinload(CaseVersion.truth_model)
        )
        .where(CaseVersion.case_version_id == session.case_version_id)
    )
    cv_res = await db.execute(cv_query)
    cv = cv_res.scalar_one_or_none()

    # 2. Fetch past conversation turns
    turns_query = (
        select(ConversationTurn)
        .where(ConversationTurn.session_id == session_id)
        .order_by(ConversationTurn.turn_index.asc())
    )
    t_res = await db.execute(turns_query)
    past_turns = t_res.scalars().all()

    turn_count = len(past_turns)

    # 3. Record student turn
    student_turn = ConversationTurn(
        session_id=session_id,
        turn_index=turn_count + 1,
        speaker="STUDENT",
        language_code=turn_in.language_code or session.primary_language,
        transcript=turn_in.message
    )
    db.add(student_turn)
    await db.flush()

    # 4. Generate Patient response via Orchestrator
    history_formatted = [
        {"role": "user" if t.speaker == "STUDENT" else "assistant", "content": t.transcript}
        for t in past_turns
    ]
    
    patient_reply = await AIPatientOrchestrator.generate_patient_turn(
        user_message=turn_in.message,
        conversation_history=history_formatted,
        persona={
            "patient_name": cv.persona.patient_name,
            "age": cv.persona.age,
            "biological_sex": cv.persona.biological_sex,
            "emotional_baseline": cv.persona.emotional_baseline,
            "communication_style": cv.persona.communication_style
        },
        clinical_truth={
            "chief_complaint": cv.truth_model.chief_complaint,
            "history_presenting": cv.truth_model.history_presenting,
            "past_medical_hist": cv.truth_model.past_medical_hist,
            "current_medications": cv.truth_model.current_medications,
            "allergies": cv.truth_model.allergies,
            "family_social_hist": cv.truth_model.family_social_hist,
            "baseline_vitals": session.session_metadata.get("current_vitals", {})
        },
        language_code=turn_in.language_code or session.primary_language
    )

    # 5. Record patient turn
    patient_turn = ConversationTurn(
        session_id=session_id,
        turn_index=turn_count + 2,
        speaker="PATIENT",
        language_code=session.primary_language,
        transcript=patient_reply
    )
    db.add(patient_turn)
    await db.commit()

    # 6. Broadcast to WebSocket subscribers for live sync
    await ws_manager.broadcast_to_session(str(session_id), {
        "event": "NEW_CONVERSATION_TURN",
        "turn": {
            "speaker": "PATIENT",
            "transcript": patient_reply,
            "turn_index": turn_count + 2
        }
    })

    return ConversationTurnResponse(
        turn_id=patient_turn.turn_id,
        turn_index=patient_turn.turn_index,
        speaker=patient_turn.speaker,
        language_code=patient_turn.language_code,
        transcript=patient_turn.transcript,
        created_at=patient_turn.created_at
    )
