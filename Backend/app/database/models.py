from datetime import datetime

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    Time,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


# ============================================================
# USER MODEL
# ============================================================

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    student_id: Mapped[str | None] = mapped_column(
        String(50),
        unique=True,
        nullable=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        nullable=False,
        index=True
    )

    password: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    role: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    department: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    year: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    section: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    phone_number: Mapped[str | None] = mapped_column(
        String(15),
        nullable=True
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # --------------------------------------------------------
    # Relationship with Outpass
    # --------------------------------------------------------

    outpasses: Mapped[list["Outpass"]] = relationship(
        "Outpass",
        back_populates="student"
    )

    # --------------------------------------------------------
    # Relationship with Approval
    # --------------------------------------------------------

    approvals: Mapped[list["Approval"]] = relationship(
        "Approval",
        back_populates="approver"
    )


# ============================================================
# OUTPASS MODEL
# ============================================================

class Outpass(Base):
    __tablename__ = "outpasses"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    request_id: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
        index=True
    )

    student_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    destination: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    from_date: Mapped[datetime] = mapped_column(
        Date,
        nullable=False
    )

    to_date: Mapped[datetime] = mapped_column(
        Date,
        nullable=False
    )

    out_time: Mapped[datetime] = mapped_column(
        Time,
        nullable=False
    )

    return_time: Mapped[datetime] = mapped_column(
        Time,
        nullable=False
    )

    request_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    reason: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    emergency_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="Pending",
        nullable=False,
        index=True
    )

    rejection_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # --------------------------------------------------------
    # Relationship with Student
    # --------------------------------------------------------

    student: Mapped["User"] = relationship(
        "User",
        back_populates="outpasses"
    )

    # --------------------------------------------------------
    # Relationship with Approval
    # --------------------------------------------------------

    approvals: Mapped[list["Approval"]] = relationship(
        "Approval",
        back_populates="outpass",
        cascade="all, delete-orphan"
    )


# ============================================================
# APPROVAL MODEL
# ============================================================

class Approval(Base):
    __tablename__ = "approvals"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    outpass_id: Mapped[int] = mapped_column(
        ForeignKey("outpasses.id"),
        nullable=False
    )

    approver_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    approver_role: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    action: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    action_date: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # --------------------------------------------------------
    # Relationship with Outpass
    # --------------------------------------------------------

    outpass: Mapped["Outpass"] = relationship(
        "Outpass",
        back_populates="approvals"
    )

    # --------------------------------------------------------
    # Relationship with Approver
    # --------------------------------------------------------

    approver: Mapped["User"] = relationship(
        "User",
        back_populates="approvals"
    )
    