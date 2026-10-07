from datetime import date, time

from pydantic import BaseModel, Field, model_validator


class OutpassCreate(BaseModel):
    destination: str = Field(
        min_length=2,
        max_length=200
    )

    from_date: date
    to_date: date

    out_time: time
    return_time: time

    request_type: str = Field(
        min_length=3,
        max_length=20
    )

    reason: str = Field(
        min_length=5,
        max_length=1000
    )

    emergency_reason: str | None = Field(
        default=None,
        max_length=1000
    )

    @model_validator(mode="after")
    def validate_dates(self):
        if self.to_date < self.from_date:
            raise ValueError(
                "To date cannot be before from date"
            )

        return self


class OutpassResponse(BaseModel):
    id: int
    request_id: str
    student_id: int
    destination: str
    from_date: date
    to_date: date
    out_time: time
    return_time: time
    request_type: str
    reason: str
    emergency_reason: str | None
    status: str

    model_config = {
        "from_attributes": True
    }