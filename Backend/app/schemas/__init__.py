from pydantic import BaseModel, EmailStr, Field


# ============================================================
# STUDENT REGISTRATION
# ============================================================

class StudentRegister(BaseModel):

    student_id: str = Field(
        min_length=3,
        max_length=50
    )

    name: str = Field(
        min_length=2,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=100
    )

    department: str = Field(
        min_length=2,
        max_length=100
    )

    year: int = Field(
        ge=1,
        le=6
    )

    section: str = Field(
        min_length=1,
        max_length=20
    )

    phone_number: str = Field(
        min_length=10,
        max_length=15
    )


# ============================================================
# USER RESPONSE
# ============================================================

class UserResponse(BaseModel):

    id: int
    student_id: str | None
    name: str
    email: EmailStr
    role: str
    department: str | None
    year: int | None
    section: str | None
    phone_number: str | None
    is_active: bool

    model_config = {
        "from_attributes": True
    }