from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.database import models
from app.routes import auth, admin, outpass


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Student Outpass Management System",
    description="Backend API for managing student outpass requests and approvals.",
    version="1.0.0",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTES
# ============================================================

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(outpass.router)
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Student Outpass Management System API is running",
        "status": "success",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "Backend is working correctly",
    }