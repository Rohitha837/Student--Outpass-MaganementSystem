from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


class PendingStudentResponse(BaseModel):
    id: int
    student_id: str | None
    name: str
    email: str
    department: str | None
    year: int | None
    section: str | None
    phone_number: str | None
    is_verified: bool


@router.get(
    "/students/pending",
    response_model=list[PendingStudentResponse]
)
def get_pending_students(
    db: Session = Depends(get_db)
):
    students = db.query(User).filter(
        User.role == "Student",
        User.is_verified == False
    ).all()

    return students


@router.patch("/students/{student_id}/verify")
def verify_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = db.query(User).filter(
        User.id == student_id,
        User.role == "Student"
    ).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    if student.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student is already verified"
        )

    student.is_verified = True

    db.commit()
    db.refresh(student)

    return {
        "message": "Student verified successfully",
        "student_id": student.student_id,
        "is_verified": student.is_verified
    }