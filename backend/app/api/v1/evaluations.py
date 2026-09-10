from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
import uuid

from app.core.database import get_db
from app.models.simulation import SimulationSession, SessionAction, ConversationTurn, SessionStatus
from app.models.clinical import CaseVersion
from app.models.assessment import ScoringRubric, SessionEvaluation
from app.schemas.evaluation import DiagnosisSubmission, EvaluationResponse
from app.services.assessment.evaluator import ClinicalAssessmentEngine
from app.services.reports.pdf_service import ClinicalPDFReportGenerator

router = APIRouter(prefix="/sessions", tags=["Evaluations & Grading"])

@router.post("/{session_id}/evaluate", response_model=EvaluationResponse)
async def submit_diagnosis_and_evaluate(
    session_id: uuid.UUID,
    sub: DiagnosisSubmission,
    db: AsyncSession = Depends(get_db)
):
    """
    Submits student final diagnosis, concludes simulation,
    and runs the automated competency scoring engine.
    """
    # 1. Fetch session
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

    # 2. Fetch Case Version, Truth Model, and Rubric
    cv_query = (
        select(CaseVersion)
        .options(
            selectinload(CaseVersion.truth_model),
            selectinload(CaseVersion.case)
        )
        .where(CaseVersion.case_version_id == session.case_version_id)
    )
    cv_res = await db.execute(cv_query)
    cv = cv_res.scalar_one_or_none()

    rubric_query = select(ScoringRubric).where(ScoringRubric.case_version_id == cv.case_version_id)
    rubric_res = await db.execute(rubric_query)
    rubric = rubric_res.scalar_one_or_none()

    # 3. Fetch conversation turns
    turns_query = select(ConversationTurn).where(ConversationTurn.session_id == session_id)
    turns_res = await db.execute(turns_query)
    turns = turns_res.scalars().all()

    # 4. Run Evaluation Engine
    eval_result = ClinicalAssessmentEngine.evaluate_session(
        rubric={
            "weight_history": float(rubric.weight_history) if rubric else 20.0,
            "weight_investigation": float(rubric.weight_investigation) if rubric else 20.0,
            "weight_treatment": float(rubric.weight_treatment) if rubric else 25.0,
            "weight_diagnosis": float(rubric.weight_diagnosis) if rubric else 20.0,
            "weight_communication": float(rubric.weight_communication) if rubric else 15.0,
            "ideal_pathway": rubric.ideal_pathway if rubric else {},
            "critical_errors_def": rubric.critical_errors_def if rubric else []
        },
        student_actions=[{"action_type": a.action_type, "action_identifier": a.action_identifier} for a in session.actions],
        conversation_turns=[{"speaker": t.speaker, "transcript": t.transcript} for t in turns],
        submitted_diagnosis=sub.primary_diagnosis,
        correct_primary=cv.truth_model.primary_diagnosis,
        hidden_diagnoses=cv.truth_model.hidden_diagnoses
    )

    # 5. Persist Session Evaluation
    evaluation = SessionEvaluation(
        session_id=session_id,
        total_score=eval_result["total_score"],
        is_passed=eval_result["is_passed"],
        score_breakdown=eval_result["score_breakdown"],
        critical_errors_hit=eval_result["critical_errors_hit"],
        strengths=eval_result["strengths"],
        areas_for_growth=eval_result["areas_for_growth"]
    )
    db.add(evaluation)

    # 6. Conclude Session
    session.session_status = SessionStatus.COMPLETED
    session.final_score = eval_result["total_score"]
    session.end_time = datetime.now(timezone.utc)
    await db.commit()

    return EvaluationResponse(
        evaluation_id=evaluation.evaluation_id,
        session_id=session_id,
        total_score=eval_result["total_score"],
        is_passed=eval_result["is_passed"],
        score_breakdown=eval_result["score_breakdown"],
        critical_errors_hit=eval_result["critical_errors_hit"],
        strengths=eval_result["strengths"],
        areas_for_growth=eval_result["areas_for_growth"],
        ideal_pathway=eval_result["ideal_pathway"],
        completed_at=evaluation.completed_at
    )

@router.get("/{session_id}/report.pdf")
async def download_session_pdf_report(session_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Downloads the official institutional accreditation & debrief PDF report."""
    eval_query = select(SessionEvaluation).where(SessionEvaluation.session_id == session_id)
    eval_res = await db.execute(eval_query)
    evaluation = eval_res.scalar_one_or_none()
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation report not found")

    pdf_bytes = ClinicalPDFReportGenerator.generate_session_report(
        session_id=str(session_id),
        student_name="Student Learner",
        case_title="Acute Chest Pain / Myocardial Infarction",
        evaluation_data={
            "total_score": float(evaluation.total_score),
            "is_passed": evaluation.is_passed,
            "score_breakdown": evaluation.score_breakdown,
            "strengths": evaluation.strengths,
            "areas_for_growth": evaluation.areas_for_growth
        }
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=clinical_report_{str(session_id)[:8]}.pdf"}
    )
