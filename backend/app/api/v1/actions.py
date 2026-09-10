from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
import uuid

from app.core.database import get_db
from app.models.simulation import SimulationSession, SessionAction, SessionVitalsLog
from app.models.clinical import CaseVersion, ScenarioState
from app.schemas.session import ActionCreateRequest, ActionResponse
from app.services.simulation.state_machine import SimulationStateMachine
from app.core.ws_manager import ws_manager

router = APIRouter(prefix="/sessions", tags=["Simulation Actions"])

@router.post("/{session_id}/action", response_model=ActionResponse)
async def perform_action(
    session_id: uuid.UUID,
    req: ActionCreateRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Executes a clinical action:
    - Examination (returns physical examination findings)
    - Investigation (returns ECG / Troponin / Radiology findings)
    - Treatment (applies medication, alters vitals, triggers state transitions)
    """
    # 1. Fetch active session
    s_query = (
        select(SimulationSession)
        .options(selectinload(SimulationSession.actions))
        .where(SimulationSession.session_id == session_id)
    )
    s_res = await db.execute(s_query)
    session = s_res.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # 2. Fetch case truth model and scenario states
    cv_query = (
        select(CaseVersion)
        .options(
            selectinload(CaseVersion.truth_model),
            selectinload(CaseVersion.states)
        )
        .where(CaseVersion.case_version_id == session.case_version_id)
    )
    cv_res = await db.execute(cv_query)
    cv = cv_res.scalar_one_or_none()
    tm = cv.truth_model

    current_vitals = session.session_metadata.get("current_vitals", tm.baseline_vitals)

    # 3. Determine action result and state progression
    result_presented = {}
    if req.action_type == "EXAMINATION":
        result_presented = tm.examination_catalog.get(
            req.action_identifier, 
            {"finding": "Examination completed; findings within physiological limits."}
        )
    elif req.action_type == "INVESTIGATION":
        result_presented = tm.investigations_db.get(
            req.action_identifier,
            {"finding": "Investigation completed; pending analysis."}
        )

    new_state, updated_vitals, state_changed, action_result = SimulationStateMachine.calculate_new_state(
        current_state_name="INITIAL",
        action_type=req.action_type,
        action_identifier=req.action_identifier,
        current_vitals=current_vitals,
        treatment_protocols=tm.treatment_protocols
    )

    if req.action_type == "TREATMENT":
        result_presented = action_result

    # 4. Save Action
    action = SessionAction(
        session_id=session_id,
        action_type=req.action_type,
        action_identifier=req.action_identifier,
        details=req.details or {},
        result_presented=result_presented
    )
    db.add(action)

    # 5. Update session vitals
    session.session_metadata["current_vitals"] = updated_vitals
    
    # 6. Log vitals time-series telemetry
    vitals_log = SessionVitalsLog(
        session_id=session_id,
        heart_rate=updated_vitals.get("hr"),
        bp_systolic=updated_vitals.get("bp_sys"),
        bp_diastolic=updated_vitals.get("bp_dia"),
        spo2_percent=updated_vitals.get("spo2"),
        respiratory_rate=updated_vitals.get("rr"),
        pain_score=updated_vitals.get("pain")
    )
    db.add(vitals_log)
    await db.commit()

    # 7. Broadcast updated vitals via WebSocket to patient monitor
    await ws_manager.broadcast_to_session(str(session_id), {
        "event": "VITALS_UPDATE",
        "vitals": updated_vitals,
        "action_taken": req.action_identifier
    })

    return ActionResponse(
        action_id=action.action_id,
        action_type=action.action_type,
        action_identifier=action.action_identifier,
        result_presented=result_presented,
        state_changed=state_changed,
        new_state=new_state if state_changed else None,
        vitals_updated=updated_vitals,
        action_timestamp=action.action_timestamp
    )
