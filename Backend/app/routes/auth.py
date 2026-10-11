from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.database.database import get_db
from app.database.models import User
from app.schemas.user import (
    StudentLogin,
    StudentRegister,
    TokenResponse,
    UserResponse,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register_student(
    student_data: StudentRegister,
    db: Session = Depends(get_db)
):
    existing_student = db.query(User).filter(
        User.student_id == student_data.student_id
    ).first()

    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student ID already registered"
        )

    existing_email = db.query(User).filter(
        User.email == student_data.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = hash_password(
        student_data.password
    )

    new_student = User(
        student_id=student_data.student_id,
        name=student_data.name,
        email=student_data.email,
        password=hashed_password,
        role="Student",
        department=student_data.department,
        year=student_data.year,
        section=student_data.section,
        phone_number=student_data.phone_number,
        is_active=True,
        is_verified=False
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK
)
def login_student(
    login_data: StudentLogin,
    db: Session = Depends(get_db)
):
    student = db.query(User).filter(
        (User.student_id == login_data.identifier)
        | (User.email == login_data.identifier)
    ).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Student ID/email or password"
        )

    if not verify_password(
        login_data.password,
        student.password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Student ID/email or password"
        )

    if not student.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student account is inactive"
        )

    if not student.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student account is not verified yet"
        )

    access_token = create_access_token(
        data={
            "sub": str(student.id),
            "student_id": student.student_id,
            "role": student.role
        },
        expires_delta=timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
@router.post(
    "/admin-login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK
)
def login_admin(
    login_data: StudentLogin,
    db: Session = Depends(get_db)
):
    admin = db.query(User).filter(
        User.email == login_data.identifier
    ).first()

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin email or password"
        )

    if admin.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is not an Admin account"
        )

    if not verify_password(
        login_data.password,
        admin.password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin email or password"
        )

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is inactive"
        )

    access_token = create_access_token(
        data={
            "sub": str(admin.id),
            "role": admin.role
        },
        expires_delta=timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
@router.post("/mentor-login", response_model=TokenResponse)
def login_mentor(
    login_data: StudentLogin,
    db: Session = Depends(get_db)
):
    mentor = db.query(User).filter(
        User.email == login_data.identifier
    ).first()

    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid mentor email or password"
        )

    if mentor.role != "Mentor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is not a Mentor account"
        )

    if not verify_password(login_data.password, mentor.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid mentor email or password"
        )

    if not mentor.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Mentor account is inactive"
        )

    access_token = create_access_token(
        data={
            "sub": str(mentor.id),
            "role": mentor.role
        },
        expires_delta=timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }