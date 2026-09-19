from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
import uuid

from app.core.database import get_db
from app.models.examination import ExamSchedule, StudentAssessment, VitalSignsRecord
from app.models.academic import Student
from app.models.clinical import Case
from app.schemas.examination import (
    StartAssessmentRequest,
    AssessmentDetailResponse,
    PatientDemographics,
    RecordVitalsRequest,
    VitalsScorecardResponse
)

router = APIRouter(prefix="/examination", tags=["Student Assessment Module"])

@router.post("/assessment/start", response_model=AssessmentDetailResponse)
async def start_student_assessment(req: StartAssessmentRequest, db: AsyncSession = Depends(get_db)):
    """
    Initializes student assessment for a scheduled examination.
    Binds: Student ID, Case ID, Schedule ID.
    Presents: Patient details (Name, Age, Gender, Doctor's Name), Chief Complaint, 
    predefined assessment sequence, and normal vital signs reference ranges.
    """
    # 1. Fetch exam schedule
    schedule_query = (
        select(ExamSchedule)
        .options(selectinload(ExamSchedule.case))
        .where(ExamSchedule.schedule_id == req.schedule_id)
    )
    res = await db.execute(schedule_query)
    schedule = res.scalar_one_or_none()
    if not schedule:
        raise HTTPException(status_code=404, detail="Exam schedule not found")

    clinical_case = schedule.case

    # 2. Fetch student
    student_query = select(Student).where(Student.student_id == req.student_id)
    st_res = await db.execute(student_query)
    student = st_res.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail=f"Student ID {req.student_id} not registered")

    # 3. Create or reuse active assessment record
    existing_query = select(StudentAssessment).where(
        StudentAssessment.schedule_id == req.schedule_id,
        StudentAssessment.student_id == req.student_id,
        StudentAssessment.status == "In Progress"
    )
    existing_res = await db.execute(existing_query)
    assessment = existing_res.scalar_one_or_none()

    if not assessment:
        assessment = StudentAssessment(
            schedule_id=req.schedule_id,
            student_id=req.student_id,
            case_id=clinical_case.case_id,
            faculty_id=schedule.faculty_id,
            status="In Progress",
            checklist_progress={}
        )
        db.add(assessment)
        await db.commit()
        await db.refresh(assessment)

    return AssessmentDetailResponse(
        assessment_id=assessment.assessment_id,
        schedule_id=schedule.schedule_id,
        student_id=student.student_id,
        student_name=student.name,
        is_backlog=student.is_backlog,
        patient=PatientDemographics(
            patient_name=clinical_case.patient_name,
            age=clinical_case.patient_age,
            gender=clinical_case.patient_gender,
            doctor_name=clinical_case.doctor_name,
            chief_complaint=clinical_case.chief_complaint
        ),
        predefined_assessment_order=clinical_case.predefined_assessment_order or [],
        target_vitals=clinical_case.target_vitals or {},
        vital_reference_ranges=clinical_case.vital_reference_ranges or {},
        status=assessment.status
    )

@router.post("/assessment/{assessment_id}/record-vitals", response_model=VitalsScorecardResponse)
async def record_sequential_vitals(
    assessment_id: uuid.UUID,
    req: RecordVitalsRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Records student vital signs in strict predefined order:
    1. Blood Pressure (BP)
    2. Pulse Rate
    3. Oxygen Saturation (SpO2)
    4. Temperature
    Evaluates values against the case target vitals and reference ranges.
    """
    assessment = await db.get(StudentAssessment, assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    clinical_case = await db.get(Case, assessment.case_id)
    targets = clinical_case.target_vitals or {
        "sys_bp": 145, "dia_bp": 95, "pulse": 104, "spo2": 93, "temp": 37.1
    }

    # 1. Checklist / Sequence score calculation (max 50)
    total_seq_items = max(1, len(clinical_case.predefined_assessment_order) if clinical_case.predefined_assessment_order else 7)
    completed_items = sum(1 for v in req.checklist.values() if v)
    sequence_score = round((completed_items / total_seq_items) * 50.0, 1)

    # 2. Vitals Accuracy scoring (max 50)
    target_sys = float(targets.get("sys_bp", 120))
    target_dia = float(targets.get("dia_bp", 80))
    target_pulse = float(targets.get("pulse", 72))
    target_spo2 = float(targets.get("spo2", 98))

    sys_diff = abs(req.step_1_bp_sys - target_sys)
    dia_diff = abs(req.step_1_bp_dia - target_dia)
    pulse_diff = abs(req.step_2_pulse - target_pulse)
    spo2_diff = abs(req.step_3_spo2 - target_spo2)

    vitals_score = 50.0
    if sys_diff > 10: vitals_score -= 8.0
    if dia_diff > 10: vitals_score -= 8.0
    if pulse_diff > 8: vitals_score -= 10.0
    if spo2_diff > 3: vitals_score -= 14.0
    vitals_score = max(0.0, round(vitals_score, 1))

    total_marks = round(sequence_score + vitals_score, 1)
    is_passed = total_marks >= 60.0

    # 3. Create or update VitalSignsRecord
    record = VitalSignsRecord(
        assessment_id=assessment_id,
        student_id=assessment.student_id,
        case_id=assessment.case_id,
        step_1_bp_sys=req.step_1_bp_sys,
        step_1_bp_dia=req.step_1_bp_dia,
        step_1_bp_status="Abnormal" if (sys_diff > 10 or dia_diff > 10) else "Normal",
        step_2_pulse=req.step_2_pulse,
        step_2_pulse_status="Abnormal" if pulse_diff > 8 else "Normal",
        step_3_spo2=req.step_3_spo2,
        step_3_spo2_status="Abnormal" if spo2_diff > 3 else "Normal",
        step_4_temp=req.step_4_temp,
        step_4_temp_status="Normal" if (36.5 <= req.step_4_temp <= 37.5) else "Abnormal",
        sequence_followed=True,
        vitals_score=vitals_score
    )
    db.add(record)

    # 4. Finalize assessment status
    assessment.checklist_progress = req.checklist
    assessment.sequence_score = sequence_score
    assessment.vitals_score = vitals_score
    assessment.total_score = total_marks
    assessment.status = "Completed"
    assessment.faculty_feedback = req.faculty_feedback
    assessment.completed_at = datetime.now(timezone.utc)

    await db.commit()

    return VitalsScorecardResponse(
        assessment_id=assessment.assessment_id,
        student_id=assessment.student_id,
        sequence_score=sequence_score,
        vitals_score=vitals_score,
        total_score=total_marks,
        is_passed=is_passed,
        breakdown={
            "blood_pressure": f"{req.step_1_bp_sys:.0f}/{req.step_1_bp_dia:.0f} mmHg (Target: {target_sys:.0f}/{target_dia:.0f})",
            "pulse_rate": f"{req.step_2_pulse} bpm (Target: {target_pulse:.0f})",
            "spo2": f"{req.step_3_spo2}% (Target: {target_spo2:.0f}%)",
            "temperature": f"{req.step_4_temp:.1f}°C"
        },
        recorded_at=record.recorded_at
    )
