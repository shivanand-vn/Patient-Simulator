from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import uuid

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash
from app.models.tenant import User, UserRole
from app.models.academic import Batch
from app.models.examination import ExamSchedule
from app.schemas.faculty import AssignedExamResponse, ChangePasswordRequest

router = APIRouter(prefix="/faculty", tags=["Faculty Module"])

@router.get("/assigned-exams/{faculty_id}", response_model=List[AssignedExamResponse])
async def get_faculty_assigned_exams(faculty_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Faculty views only the examinations assigned to them by the Admin.
    Displays: Batch, Case, Exam Date, Exam Time, Doctor Name, Patient Name.
    If no examination is assigned, returns an empty array.
    """
    query = (
        select(ExamSchedule)
        .options(
            selectinload(ExamSchedule.batch).selectinload(Batch.students),
            selectinload(ExamSchedule.case)
        )
        .where(ExamSchedule.faculty_id == faculty_id)
        .order_by(ExamSchedule.exam_date.asc(), ExamSchedule.exam_time.asc())
    )
    result = await db.execute(query)
    schedules = result.scalars().all()

    res = []
    for s in schedules:
        c = s.case
        student_count = len(s.batch.students) if s.batch and s.batch.students else 0
        res.append(AssignedExamResponse(
            schedule_id=s.schedule_id,
            batch_name=s.batch.batch_name if s.batch else "Assigned Batch",
            case_id=s.case_id,
            case_title=c.title if c else "Assigned Case",
            category=getattr(c, 'category', 'Cardiology') if c else 'Cardiology',
            doctor_name=c.doctor_name if c else 'Attending Physician',
            patient_name=c.patient_name if c else 'Patient',
            patient_age=c.patient_age if c else 50,
            patient_gender=c.patient_gender if c else 'Male',
            chief_complaint=c.chief_complaint if c else '',
            exam_date=s.exam_date,
            exam_time=s.exam_time,
            rig_location=s.rig_location,
            status=s.status,
            student_count=student_count
        ))
    return res

@router.post("/{faculty_id}/change-password")
async def change_faculty_password(faculty_id: uuid.UUID, req: ChangePasswordRequest, db: AsyncSession = Depends(get_db)):
    """Faculty can change their default password on first login."""
    user = await db.get(User, faculty_id)
    if not user:
        raise HTTPException(status_code=404, detail="Faculty user not found")

    if not verify_password(req.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    user.password_hash = get_password_hash(req.new_password)
    user.must_change_password = False
    await db.commit()

    return {"message": "Password updated successfully", "must_change_password": False}
