import uuid
from typing import List, Optional
from datetime import datetime
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Text, SmallInteger, Numeric, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base
import enum

class SessionStatus(str, enum.Enum):
    READY = "READY"
    ACTIVE = "ACTIVE"
    PAUSED = "PAUSED"
    COMPLETED = "COMPLETED"
    ABORTED = "ABORTED"
    TIMED_OUT = "TIMED_OUT"

class SimulationSession(Base):
    __tablename__ = "simulation_sessions"
    __table_args__ = {"schema": "simulation"}

    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenant.institutions.institution_id"), nullable=False)
    student_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenant.users.user_id"), nullable=False)
    case_version_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clinical.case_versions.case_version_id"), nullable=False)
    session_status: Mapped[SessionStatus] = mapped_column(SQLEnum(SessionStatus, name="session_status", schema="simulation"), default=SessionStatus.READY, nullable=False)
    current_state_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("clinical.scenario_states.state_id"), nullable=True)
    primary_language: Mapped[str] = mapped_column(String(10), default="en", nullable=False)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.clock_timestamp())
    end_time: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    final_score: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), nullable=True)
    session_metadata: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)

    actions: Mapped[List["SessionAction"]] = relationship("SessionAction", back_populates="session", cascade="all, delete-orphan")

class ConversationTurn(Base):
    __tablename__ = "conversation_turns"
    __table_args__ = {"schema": "simulation"}

    turn_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    turn_index: Mapped[int] = mapped_column(Integer, nullable=False)
    speaker: Mapped[str] = mapped_column(String(20), nullable=False) # STUDENT, PATIENT, SYSTEM
    language_code: Mapped[str] = mapped_column(String(10), default="en", nullable=False)
    transcript: Mapped[str] = mapped_column(Text, nullable=False)
    audio_file_uri: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sentiment_detected: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    llm_tokens_consumed: Mapped[int] = mapped_column(Integer, default=0)
    orchestrator_latency_ms: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), primary_key=True, server_default=func.clock_timestamp())

class SessionVitalsLog(Base):
    __tablename__ = "session_vitals_log"
    __table_args__ = {"schema": "simulation"}

    vitals_log_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), primary_key=True, server_default=func.clock_timestamp())
    heart_rate: Mapped[Optional[int]] = mapped_column(SmallInteger, nullable=True)
    bp_systolic: Mapped[Optional[int]] = mapped_column(SmallInteger, nullable=True)
    bp_diastolic: Mapped[Optional[int]] = mapped_column(SmallInteger, nullable=True)
    spo2_percent: Mapped[Optional[int]] = mapped_column(SmallInteger, nullable=True)
    respiratory_rate: Mapped[Optional[int]] = mapped_column(SmallInteger, nullable=True)
    temperature_c: Mapped[Optional[float]] = mapped_column(Numeric(4, 2), nullable=True)
    pain_score: Mapped[Optional[int]] = mapped_column(SmallInteger, nullable=True)
    dynamic_payload: Mapped[dict] = mapped_column(JSONB, default=dict)

class SessionAction(Base):
    __tablename__ = "session_actions"
    __table_args__ = {"schema": "simulation"}

    action_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("simulation.simulation_sessions.session_id"), nullable=False)
    action_type: Mapped[str] = mapped_column(String(30), nullable=False) # EXAMINATION, INVESTIGATION, TREATMENT, DIAGNOSIS_SUBMIT
    action_identifier: Mapped[str] = mapped_column(String(100), nullable=False)
    details: Mapped[dict] = mapped_column(JSONB, default=dict)
    result_presented: Mapped[dict] = mapped_column(JSONB, default=dict)
    is_critical_error: Mapped[bool] = mapped_column(Boolean, default=False)
    action_timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.clock_timestamp())

    session: Mapped["SimulationSession"] = relationship("SimulationSession", back_populates="actions")
