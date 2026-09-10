import uuid
from typing import List, Optional
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text, Numeric, func
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class ScoringRubric(Base):
    __tablename__ = "scoring_rubrics"
    __table_args__ = {"schema": "assessment"}

    rubric_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_version_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clinical.case_versions.case_version_id"), unique=True, nullable=False)
    weight_history: Mapped[float] = mapped_column(Numeric(4, 2), default=20.00)
    weight_examination: Mapped[float] = mapped_column(Numeric(4, 2), default=15.00)
    weight_investigation: Mapped[float] = mapped_column(Numeric(4, 2), default=15.00)
    weight_treatment: Mapped[float] = mapped_column(Numeric(4, 2), default=20.00)
    weight_diagnosis: Mapped[float] = mapped_column(Numeric(4, 2), default=20.00)
    weight_communication: Mapped[float] = mapped_column(Numeric(4, 2), default=10.00)
    critical_errors_def: Mapped[list] = mapped_column(JSONB, default=list)
    ideal_pathway: Mapped[dict] = mapped_column(JSONB, default=dict)

class SessionEvaluation(Base):
    __tablename__ = "session_evaluations"
    __table_args__ = {"schema": "assessment"}

    evaluation_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("simulation.simulation_sessions.session_id"), unique=True, nullable=False)
    evaluator_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("tenant.users.user_id"), nullable=True)
    total_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    is_passed: Mapped[bool] = mapped_column(Boolean, default=False)
    score_breakdown: Mapped[dict] = mapped_column(JSONB, default=dict)
    critical_errors_hit: Mapped[list] = mapped_column(JSONB, default=list)
    strengths: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    areas_for_growth: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    faculty_comments: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.clock_timestamp())
