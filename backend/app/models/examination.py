import uuid
from typing import List, Optional
from datetime import date, time, datetime
from sqlalchemy import String, Integer, Boolean, DateTime, Date, Time, ForeignKey, Text, Numeric, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class ExamSchedule(Base):
    __tablename__ = "exam_schedules"
    __table_args__ = {"schema": "examination"}

    schedule_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("academic.batches.batch_id"), nullable=False)
    case_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clinical.cases.case_id"), nullable=False)
    faculty_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenant.users.user_id"), nullable=False)
    exam_date: Mapped[date] = mapped_column(Date, nullable=False)
    exam_time: Mapped[time] = mapped_column(Time, nullable=False)
    rig_location: Mapped[str] = mapped_column(String(100), default="Simulation Room 1")
    status: Mapped[str] = mapped_column(String(30), default="Scheduled", nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("tenant.users.user_id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.clock_timestamp())

    batch: Mapped["Batch"] = relationship("Batch", back_populates="schedules")
    case: Mapped["Case"] = relationship("Case")
    faculty: Mapped["User"] = relationship("User", foreign_keys=[faculty_id])
    assessments: Mapped[List["StudentAssessment"]] = relationship("StudentAssessment", back_populates="schedule", cascade="all, delete-orphan")

class StudentAssessment(Base):
    __tablename__ = "student_assessments"
    __table_args__ = {"schema": "examination"}

    assessment_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    schedule_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("examination.exam_schedules.schedule_id"), nullable=False)
    student_id: Mapped[str] = mapped_column(String(50), ForeignKey("academic.students.student_id"), nullable=False)
    case_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clinical.cases.case_id"), nullable=False)
    faculty_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenant.users.user_id"), nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="In Progress", nullable=False)
    checklist_progress: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    sequence_score: Mapped[float] = mapped_column(Numeric(5, 2), default=0.00)
    vitals_score: Mapped[float] = mapped_column(Numeric(5, 2), default=0.00)
    total_score: Mapped[float] = mapped_column(Numeric(5, 2), default=0.00)
    faculty_feedback: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.clock_timestamp())
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    schedule: Mapped["ExamSchedule"] = relationship("ExamSchedule", back_populates="assessments")
    student: Mapped["Student"] = relationship("Student", back_populates="assessments")
    case: Mapped["Case"] = relationship("Case")
    vitals_record: Mapped[Optional["VitalSignsRecord"]] = relationship("VitalSignsRecord", back_populates="assessment", uselist=False, cascade="all, delete-orphan")

class VitalSignsRecord(Base):
    __tablename__ = "vital_signs_records"
    __table_args__ = {"schema": "examination"}

    record_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("examination.student_assessments.assessment_id"), unique=True, nullable=False)
    student_id: Mapped[str] = mapped_column(String(50), nullable=False)
    case_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    step_1_bp_sys: Mapped[float] = mapped_column(Numeric(5, 1), nullable=False)
    step_1_bp_dia: Mapped[float] = mapped_column(Numeric(5, 1), nullable=False)
    step_1_bp_status: Mapped[str] = mapped_column(String(30), default="Normal")
    step_2_pulse: Mapped[int] = mapped_column(Integer, nullable=False)
    step_2_pulse_status: Mapped[str] = mapped_column(String(30), default="Normal")
    step_3_spo2: Mapped[int] = mapped_column(Integer, nullable=False)
    step_3_spo2_status: Mapped[str] = mapped_column(String(30), default="Normal")
    step_4_temp: Mapped[float] = mapped_column(Numeric(4, 1), nullable=False)
    step_4_temp_status: Mapped[str] = mapped_column(String(30), default="Normal")
    sequence_followed: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    vitals_score: Mapped[float] = mapped_column(Numeric(5, 2), default=50.00)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.clock_timestamp())

    assessment: Mapped["StudentAssessment"] = relationship("StudentAssessment", back_populates="vitals_record")
