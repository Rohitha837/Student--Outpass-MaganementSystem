from app.core.security import hash_password
from app.database.database import SessionLocal
from app.database.models import User


ADMIN_EMAIL = "admin@outpass.com"
ADMIN_PASSWORD = "Admin@12345"


db = SessionLocal()

try:
    existing_admin = db.query(User).filter(
        User.email == ADMIN_EMAIL
    ).first()

    if existing_admin:
        print("Admin account already exists.")

    else:
        admin = User(
            student_id=None,
            name="System Admin",
            email=ADMIN_EMAIL,
            password=hash_password(ADMIN_PASSWORD),
            role="Admin",
            department=None,
            year=None,
            section=None,
            phone_number=None,
            is_active=True,
            is_verified=True
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("Admin account created successfully!")
        print("Admin ID:", admin.id)
        print("Admin Email:", admin.email)

finally:
    db.close()