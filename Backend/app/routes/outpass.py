from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.database import get_db
from app.database.models import Outpass, User
from app.schemas.outpass import OutpassCreate, OutpassResponse


router = APIRouter(
    prefix="/outpasses",
    tags=["Outpasses"]
)


# ============================================================
# CREATE OUTPASS
# ============================================================

@router.post(
    "/",
    response_model=OutpassResponse,
    status_code=status.HTTP_201_CREATED
)
def create_outpass(
    outpass_data: OutpassCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Only students can create outpass requests
    if current_user.role != "Student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can create outpass requests"
        )

    # Student must be verified
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student account is not verified"
        )

    # Generate request ID
    current_count = db.query(Outpass).count() + 1
    request_id = f"OUT{current_count:03d}"

    while db.query(Outpass).filter(
        Outpass.request_id == request_id
    ).first():

        current_count += 1
        request_id = f"OUT{current_count:03d}"

    # Create outpass for the logged-in student
    new_outpass = Outpass(
        request_id=request_id,
        student_id=current_user.id,
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


# ============================================================
# GET MY REQUESTS
# ============================================================

@router.get(
    "/my-requests",
    response_model=list[OutpassResponse]
)
def get_my_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Only students can view their requests
    if current_user.role != "Student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can view their requests"
        )

    outpasses = db.query(Outpass).filter(
        Outpass.student_id == current_user.id
    ).order_by(
        Outpass.created_at.desc()
    ).all()

    return outpasses
