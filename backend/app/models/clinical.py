import uuid
from typing import List, Optional
from datetime import datetime
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Text, SmallInteger, func
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base
import enum

class CaseStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    UNDER_REVIEW = "UNDER_REVIEW"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"

class DifficultyLevel(str, enum.Enum):
    NOVICE = "NOVICE"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"
    EXPERT = "EXPERT"

class Case(Base):
    __tablename__ = "cases"
    __table_args__ = {"schema": "clinical"}

    case_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("tenant.institutions.institution_id"), nullable=True)
    case_code: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    medical_specialty: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(String(100), default="Cardiology", nullable=False) # Cardiology, Respiratory
    difficulty: Mapped[DifficultyLevel] = mapped_column(SQLEnum(DifficultyLevel, name="difficulty_level", schema="clinical"), default=DifficultyLevel.INTERMEDIATE, nullable=False)
    
    # Doctor & Patient Demographics
    doctor_name: Mapped[str] = mapped_column(String(255), default="Attending Physician", nullable=False)
    patient_name: Mapped[str] = mapped_column(String(150), default="Patient", nullable=False)
    patient_age: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    patient_gender: Mapped[str] = mapped_column(String(20), default="Male", nullable=False)
    chief_complaint: Mapped[str] = mapped_column(Text, default="", nullable=False)
    
    # Target Vitals & Reference Ranges
    target_vitals: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    vital_reference_ranges: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    predefined_assessment_order: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)

    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("tenant.users.user_id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.clock_timestamp())

    versions: Mapped[List["CaseVersion"]] = relationship("CaseVersion", back_populates="case")

class CaseVersion(Base):
    __tablename__ = "case_versions"
    __table_args__ = {"schema": "clinical"}

    case_version_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clinical.cases.case_id"), nullable=False)
    version_number: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[CaseStatus] = mapped_column(SQLEnum(CaseStatus, name="case_status", schema="clinical"), default=CaseStatus.DRAFT, nullable=False)
    clinical_summary: Mapped[str] = mapped_column(Text, nullable=False)
    supported_languages: Mapped[List[str]] = mapped_column(ARRAY(String), default=["en", "hi", "kn"])
    is_locked: Mapped[bool] = mapped_column(Boolean, default=False)
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.clock_timestamp())

    case: Mapped["Case"] = relationship("Case", back_populates="versions")
    persona: Mapped["PatientPersona"] = relationship("PatientPersona", back_populates="case_version", uselist=False)
    truth_model: Mapped["ClinicalTruthModel"] = relationship("ClinicalTruthModel", back_populates="case_version", uselist=False)
    states: Mapped[List["ScenarioState"]] = relationship("ScenarioState", back_populates="case_version")

class PatientPersona(Base):
    __tablename__ = "patient_personas"
    __table_args__ = {"schema": "clinical"}

    persona_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_version_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clinical.case_versions.case_version_id"), unique=True, nullable=False)
    patient_name: Mapped[str] = mapped_column(String(150), nullable=False)
    age: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    biological_sex: Mapped[str] = mapped_column(String(20), nullable=False)
    emotional_baseline: Mapped[str] = mapped_column(String(50), default="ANXIOUS")
    communication_style: Mapped[str] = mapped_column(String(50), default="ARTICULATE")
    pain_level_baseline: Mapped[int] = mapped_column(SmallInteger, default=0)
    voice_config: Mapped[dict] = mapped_column(JSONB, default=dict)
    persona_rules: Mapped[dict] = mapped_column(JSONB, default=dict)

    case_version: Mapped["CaseVersion"] = relationship("CaseVersion", back_populates="persona")

class ClinicalTruthModel(Base):
    __tablename__ = "clinical_truth_models"
    __table_args__ = {"schema": "clinical"}

    truth_model_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_version_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clinical.case_versions.case_version_id"), unique=True, nullable=False)
    chief_complaint: Mapped[str] = mapped_column(Text, nullable=False)
    history_presenting: Mapped[str] = mapped_column(Text, nullable=False)
    past_medical_hist: Mapped[list] = mapped_column(JSONB, default=list)
    current_medications: Mapped[list] = mapped_column(JSONB, default=list)
    allergies: Mapped[list] = mapped_column(JSONB, default=list)
    family_social_hist: Mapped[dict] = mapped_column(JSONB, default=dict)
    primary_diagnosis: Mapped[str] = mapped_column(String(255), nullable=False)
    differential_diag: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    hidden_diagnoses: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    baseline_vitals: Mapped[dict] = mapped_column(JSONB, default=dict)
    examination_catalog: Mapped[dict] = mapped_column(JSONB, default=dict)
    investigations_db: Mapped[dict] = mapped_column(JSONB, default=dict)
    treatment_protocols: Mapped[dict] = mapped_column(JSONB, default=dict)

    case_version: Mapped["CaseVersion"] = relationship("CaseVersion", back_populates="truth_model")

class ScenarioState(Base):
    __tablename__ = "scenario_states"
    __table_args__ = {"schema": "clinical"}

    state_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_version_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clinical.case_versions.case_version_id"), nullable=False)
    state_name: Mapped[str] = mapped_column(String(50), nullable=False)
    vitals_override: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    transition_rules: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)

    case_version: Mapped["CaseVersion"] = relationship("CaseVersion", back_populates="states")
