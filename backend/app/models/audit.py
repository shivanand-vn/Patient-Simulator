import uuid
from typing import Optional
from datetime import datetime
from sqlalchemy import String, DateTime, Text, func
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base

class SecurityAuditLog(Base):
    __tablename__ = "security_audit_logs"
    __table_args__ = {"schema": "audit"}

    audit_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)
    event_category: Mapped[str] = mapped_column(String(50), nullable=False)
    event_action: Mapped[str] = mapped_column(String(100), nullable=False)
    ip_address: Mapped[Optional[str]] = mapped_column(INET, nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    payload_before: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    payload_after: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    event_timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), primary_key=True, server_default=func.clock_timestamp())
