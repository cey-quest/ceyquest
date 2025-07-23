from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database import get_db
from ..models import Subject, Resource
from ..schemas import Subject as SubjectSchema, Resource as ResourceSchema
from ..auth import get_current_active_user

router = APIRouter(prefix="/subjects", tags=["subjects"])

@router.get("/", response_model=List[SubjectSchema])
async def get_subjects(
    grade: int = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all subjects, optionally filtered by grade"""
    query = select(Subject).where(Subject.is_active == True)
    
    if grade is not None:
        query = query.where(Subject.grade == grade)
    
    result = await db.execute(query)
    subjects = result.scalars().all()
    
    return subjects

@router.get("/{subject_id}", response_model=SubjectSchema)
async def get_subject(subject_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific subject by ID"""
    result = await db.execute(select(Subject).where(Subject.id == subject_id))
    subject = result.scalar_one_or_none()
    
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )
    
    return subject

@router.get("/{subject_id}/resources", response_model=List[ResourceSchema])
async def get_subject_resources(
    subject_id: int,
    resource_type: str = None,
    db: AsyncSession = Depends(get_db)
):
    """Get resources for a specific subject"""
    # First check if subject exists
    subject_result = await db.execute(select(Subject).where(Subject.id == subject_id))
    subject = subject_result.scalar_one_or_none()
    
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )
    
    # Get resources
    query = select(Resource).where(Resource.subject_id == subject_id)
    
    if resource_type:
        query = query.where(Resource.resource_type == resource_type)
    
    result = await db.execute(query)
    resources = result.scalars().all()
    
    return resources

@router.get("/resources/{resource_id}", response_model=ResourceSchema)
async def get_resource(resource_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific resource by ID"""
    result = await db.execute(select(Resource).where(Resource.id == resource_id))
    resource = result.scalar_one_or_none()
    
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    
    return resource 