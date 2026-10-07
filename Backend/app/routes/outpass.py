from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Outpass, User
from app.schemas.outpass import OutpassCreate, OutpassResponse


router = APIRouter(
    prefix="/outpasses",
    tags=["Outpasses"]
)


@router.post(
    "/",
    response_model=OutpassResponse,
    status_code=status.HTTP_201_CREATED
)
def create_outpass(
    outpass_data: OutpassCreate,
    db: Session = Depends(get_db)
):
    student = db.query(User).filter(
        User.role == "Student",
        User.is_verified == True
    ).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No verified student found"
        )

    current_count = db.query(Outpass).count() + 1
    request_id = f"OUT{current_count:03d}"

    while db.query(Outpass).filter(
        Outpass.request_id == request_id
    ).first():
        current_count += 1
        request_id = f"OUT{current_count:03d}"

    new_outpass = Outpass(
        request_id=request_id,
        student_id=student.id,
        destination=outpass_data.destination,
        from_date=outpass_data.from_date,
        to_date=outpass_data.to_date,
        out_time=outpass_data.out_time,
        return_time=outpass_data.return_time,
        request_type=outpass_data.request_type,
        reason=outpass_data.reason,
        emergency_reason=outpass_data.emergency_reason,
        status="Pending"
    )

    db.add(new_outpass)
    db.commit()
    db.refresh(new_outpass)

    return new_outpass


@router.get(
    "/my-requests",
    response_model=list[OutpassResponse]
)
def get_my_requests(
    db: Session = Depends(get_db)
):
    student = db.query(User).filter(
        User.role == "Student",
        User.is_verified == True
    ).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No verified student found"
        )

    outpasses = db.query(Outpass).filter(
        Outpass.student_id == student.id
    ).order_by(
        Outpass.created_at.desc()
    ).all()

    return outpasses