from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.database import get_db
from app.database.models import Outpass, User

router = APIRouter(prefix="/mentor", tags=["Mentor"])


class RejectRequest(BaseModel):
    reason: str


def require_mentor(current_user: User = Depends(get_current_user)):
    if current_user.role != "Mentor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only mentors can perform this action"
        )
    return current_user


@router.get("/requests")
def get_mentor_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_mentor)
):
    requests = (
        db.query(Outpass)
        .filter(Outpass.status == "Pending")
        .order_by(Outpass.created_at.desc())
        .all()
    )

    return requests


@router.patch("/requests/{request_id}/approve")
def approve_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_mentor)
):
    outpass = db.query(Outpass).filter(Outpass.id == request_id).first()

    if not outpass:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Outpass request not found"
        )

    if outpass.status != "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Request cannot be approved because its current status is {outpass.status}"
        )

    outpass.status = "Mentor Approved"

    db.commit()
    db.refresh(outpass)

    return {
        "message": "Outpass approved by Mentor",
        "request_id": outpass.request_id,
        "status": outpass.status
    }


@router.patch("/requests/{request_id}/reject")
def reject_request(
    request_id: int,
    reject_data: RejectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_mentor)
):
    outpass = db.query(Outpass).filter(Outpass.id == request_id).first()

    if not outpass:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Outpass request not found"
        )

    if outpass.status != "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Request cannot be rejected because its current status is {outpass.status}"
        )

    if not reject_data.reason.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rejection reason is required"
        )

    outpass.status = "Rejected"

    # Store rejection reason if your model already has this column.
    if hasattr(outpass, "rejection_reason"):
        outpass.rejection_reason = reject_data.reason.strip()

    db.commit()
    db.refresh(outpass)

    return {
        "message": "Outpass rejected by Mentor",
        "request_id": outpass.request_id,
        "status": outpass.status,
        "reason": reject_data.reason.strip()
    }