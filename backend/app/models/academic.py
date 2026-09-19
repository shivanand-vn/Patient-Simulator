import uuid
from typing import List, Optional
from datetime import datetime
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class Batch(Base):
    __tablename__ = "batches"
    __table_args__ = {"schema": "academic"}

    batch_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("tenant.institutions.institution_id"), nullable=True)
    batch_name: Mapped[str] = mapped_column(String(150), nullable=False)
    academic_year: Mapped[str] = mapped_column(String(50), nullable=False)
    clinical_track: Mapped[str] = mapped_column(String(100), default="MBBS General Clinical")
    capacity: Mapped[int] = mapped_column(Integer, default=60, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="Active", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.clock_timestamp())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.clock_timestamp(), onupdate=func.clock_timestamp())

    students: Mapped[List["Student"]] = relationship("Student", back_populates="batch", cascade="all, delete-orphan")
    schedules: Mapped[List["ExamSchedule"]] = relationship("ExamSchedule", back_populates="batch")

class Student(Base):
    __tablename__ = "students"
    __table_args__ = {"schema": "academic"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[str] = mapped_column(String(50), unique=True, nullable=False) # e.g. BMC2026001
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    batch_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("academic.batches.batch_id"), nullable=True)
    year_of_joining: Mapped[int] = mapped_column(Integer, nullable=False)
    is_backlog: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.clock_timestamp())

    batch: Mapped[Optional["Batch"]] = relationship("Batch", back_populates="students")
    assessments: Mapped[List["StudentAssessment"]] = relationship("StudentAssessment", back_populates="student")
