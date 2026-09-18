from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List
import uuid

from app.core.database import get_db
from app.core.security import get_password_hash
from app.models.tenant import User, UserRole, Institution
from app.models.academic import Batch, Student
from app.models.clinical import Case, DifficultyLevel
from app.models.examination import ExamSchedule
from app.schemas.admin import (
    FacultyCreateRequest, FacultyResponse,
    BatchCreateRequest, BatchResponse,
    StudentCreateRequest, StudentResponse,
    CaseCreateRequest, AdminCaseResponse,
    ExamScheduleCreateRequest, ExamScheduleResponse
)

router = APIRouter(prefix="/admin", tags=["Admin Module"])

# ----------------------------------------------------------------------
# Faculty Management
# ----------------------------------------------------------------------
@router.post("/faculty", response_model=FacultyResponse)
async def add_faculty(req: FacultyCreateRequest, db: AsyncSession = Depends(get_db)):
    """Admin adds a new faculty member with default password and contact number."""
    inst_query = select(Institution).limit(1)
    inst_res = await db.execute(inst_query)
    inst = inst_res.scalar_one_or_none()
    inst_id = inst.institution_id if inst else uuid.uuid4()

    # Check if email exists
    user_check = await db.execute(select(User).where(User.email == req.email))
    if user_check.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Faculty with this email already exists")

    new_faculty = User(
        user_id=uuid.uuid4(),
        institution_id=inst_id,
        email=req.email,
        full_name=req.name,
        role=UserRole.FACULTY,
        password_hash=get_password_hash(req.default_password),
        contact_number=req.contact_number,
        must_change_password=True,
        is_active=True
    )
    db.add(new_faculty)
    await db.commit()
    await db.refresh(new_faculty)

    return FacultyResponse(
        id=new_faculty.user_id,
        name=new_faculty.full_name,
        email=new_faculty.email,
        phone=new_faculty.contact_number,
        role=new_faculty.role.value,
        must_change_password=new_faculty.must_change_password,
        status="Active" if new_faculty.is_active else "On Leave"
    )

@router.get("/faculty", response_model=List[FacultyResponse])
async def list_faculty(db: AsyncSession = Depends(get_db)):
    """Admin views and manages all faculty members."""
    query = select(User).where(User.role == UserRole.FACULTY).order_by(User.full_name.asc())
    result = await db.execute(query)
    faculty_list = result.scalars().all()

    return [
        FacultyResponse(
            id=f.user_id,
            name=f.full_name,
            email=f.email,
            phone=f.contact_number,
            role=f.role.value,
            must_change_password=f.must_change_password,
            status="Active" if f.is_active else "On Leave"
        )
        for f in faculty_list
    ]

# ----------------------------------------------------------------------
# Batch & Student Management
# ----------------------------------------------------------------------
@router.post("/batches", response_model=BatchResponse)
async def create_batch(req: BatchCreateRequest, db: AsyncSession = Depends(get_db)):
    """Admin creates a new student batch (e.g. ~59 students capacity)."""
    batch = Batch(
        batch_name=req.batch_name,
        academic_year=req.academic_year,
        clinical_track=req.clinical_track or "MBBS General Clinical",
        capacity=req.capacity,
        status="Active"
    )
    db.add(batch)
    await db.commit()
    await db.refresh(batch)

    return BatchResponse(
        batch_id=batch.batch_id,
        batch_name=batch.batch_name,
        academic_year=batch.academic_year,
        clinical_track=batch.clinical_track,
        capacity=batch.capacity,
        enrolled_count=0,
        backlog_count=0,
        status=batch.status
    )

@router.get("/batches", response_model=List[BatchResponse])
async def list_batches(db: AsyncSession = Depends(get_db)):
    """Admin lists all student batches with live enrolled and backlog counts."""
    query = select(Batch).options(selectinload(Batch.students)).order_by(Batch.created_at.desc())
    result = await db.execute(query)
    batches = result.scalars().all()

    res = []
    for b in batches:
        students = b.students or []
        enrolled = len(students)
        backlogs = sum(1 for s in students if s.is_backlog)
        res.append(BatchResponse(
            batch_id=b.batch_id,
            batch_name=b.batch_name,
            academic_year=b.academic_year,
            clinical_track=b.clinical_track,
            capacity=b.capacity,
            enrolled_count=enrolled,
            backlog_count=backlogs,
            status=b.status
        ))
    return res

@router.post("/batches/{batch_id}/students", response_model=StudentResponse)
async def add_student_to_batch(batch_id: uuid.UUID, req: StudentCreateRequest, db: AsyncSession = Depends(get_db)):
    """Admin adds a student (regular or backlog) to a batch."""
    batch = await db.get(Batch, batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    student = Student(
        student_id=req.student_id,
        name=req.name,
        batch_id=batch_id,
        year_of_joining=req.year_of_joining,
        is_backlog=req.is_backlog,
        email=req.email,
        phone=req.phone
    )
    db.add(student)
    await db.commit()
    await db.refresh(student)

    return StudentResponse(
        id=student.id,
        student_id=student.student_id,
        name=student.name,
        batch_id=student.batch_id,
        year_of_joining=student.year_of_joining,
        is_backlog=student.is_backlog,
        email=student.email,
        phone=student.phone
    )

@router.get("/batches/{batch_id}/students", response_model=List[StudentResponse])
async def list_students_in_batch(batch_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Admin views students enrolled in a specific batch."""
    query = select(Student).where(Student.batch_id == batch_id).order_by(Student.student_id.asc())
    result = await db.execute(query)
    return result.scalars().all()

# ----------------------------------------------------------------------
# Case Management
# ----------------------------------------------------------------------
@router.get("/cases", response_model=List[AdminCaseResponse])
async def list_admin_cases(db: AsyncSession = Depends(get_db)):
    """Admin views all clinical cases across categories (Cardiology, Respiratory, etc.)."""
    query = select(Case).order_by(Case.title.asc())
    result = await db.execute(query)
    cases = result.scalars().all()

    return [
        AdminCaseResponse(
            case_id=c.case_id,
            case_code=c.case_code,
            title=c.title,
            category=getattr(c, 'category', c.medical_specialty),
            doctor_name=c.doctor_name,
            patient_name=c.patient_name,
            patient_age=c.patient_age,
            patient_gender=c.patient_gender,
            chief_complaint=c.chief_complaint,
            difficulty=c.difficulty.value if hasattr(c.difficulty, 'value') else str(c.difficulty),
            target_vitals=c.target_vitals or {}
        )
        for c in cases
    ]

# ----------------------------------------------------------------------
# Exam Scheduling (Admin binds: Batch + Case + Faculty + Date + Time)
# ----------------------------------------------------------------------
@router.post("/schedules", response_model=ExamScheduleResponse)
async def schedule_examination(req: ExamScheduleCreateRequest, db: AsyncSession = Depends(get_db)):
    """Only Admin schedules examinations by assigning Batch, Case, Faculty, Date, and Time."""
    batch = await db.get(Batch, req.batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    clinical_case = await db.get(Case, req.case_id)
    if not clinical_case:
        raise HTTPException(status_code=404, detail="Case not found")

    faculty = await db.get(User, req.faculty_id)
    if not faculty or faculty.role != UserRole.FACULTY:
        raise HTTPException(status_code=404, detail="Faculty not found")

    new_schedule = ExamSchedule(
        batch_id=req.batch_id,
        case_id=req.case_id,
        faculty_id=req.faculty_id,
        exam_date=req.exam_date,
        exam_time=req.exam_time,
        rig_location=req.rig_location or "Simulation Room 1",
        status="Scheduled",
        notes=req.notes
    )
    db.add(new_schedule)
    await db.commit()
    await db.refresh(new_schedule)

    # Get student count in batch
    count_query = select(func.count()).select_from(Student).where(Student.batch_id == req.batch_id)
    count_res = await db.execute(count_query)
    student_count = count_res.scalar() or 0

    return ExamScheduleResponse(
        schedule_id=new_schedule.schedule_id,
        batch_id=batch.batch_id,
        batch_name=batch.batch_name,
        case_id=clinical_case.case_id,
        case_title=clinical_case.title,
        case_category=getattr(clinical_case, 'category', 'Cardiology'),
        faculty_id=faculty.user_id,
        faculty_name=faculty.full_name,
        exam_date=new_schedule.exam_date,
        exam_time=new_schedule.exam_time,
        rig_location=new_schedule.rig_location,
        status=new_schedule.status,
        student_count=student_count
    )

@router.get("/schedules", response_model=List[ExamScheduleResponse])
async def list_all_exam_schedules(db: AsyncSession = Depends(get_db)):
    """Admin views all scheduled examinations."""
    query = (
        select(ExamSchedule)
        .options(
            selectinload(ExamSchedule.batch).selectinload(Batch.students),
            selectinload(ExamSchedule.case),
            selectinload(ExamSchedule.faculty)
        )
        .order_by(ExamSchedule.exam_date.desc(), ExamSchedule.exam_time.desc())
    )
    result = await db.execute(query)
    schedules = result.scalars().all()

    res = []
    for s in schedules:
        student_count = len(s.batch.students) if s.batch and s.batch.students else 0
        res.append(ExamScheduleResponse(
            schedule_id=s.schedule_id,
            batch_id=s.batch_id,
            batch_name=s.batch.batch_name if s.batch else "Unknown Batch",
            case_id=s.case_id,
            case_title=s.case.title if s.case else "Unknown Case",
            case_category=getattr(s.case, 'category', 'Cardiology') if s.case else 'Cardiology',
            faculty_id=s.faculty_id,
            faculty_name=s.faculty.full_name if s.faculty else "Unassigned",
            exam_date=s.exam_date,
            exam_time=s.exam_time,
            rig_location=s.rig_location,
            status=s.status,
            student_count=student_count
        ))
    return res

@router.delete("/schedules/{schedule_id}")
async def cancel_examination(schedule_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Admin cancels an exam schedule."""
    schedule = await db.get(ExamSchedule, schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Exam schedule not found")
    await db.delete(schedule)
    await db.commit()
    return {"message": "Exam schedule cancelled successfully"}
