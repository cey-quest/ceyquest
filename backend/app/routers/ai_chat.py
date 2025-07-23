from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database import get_db
from ..models import User, Profile, Subject
from ..schemas import ChatMessage, ChatResponse
from ..auth import get_current_active_user
from ..ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["ai-chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ceynovx(
    message: ChatMessage,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Chat with CeynovX AI assistant"""
    
    # Get user profile for context
    profile_result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = profile_result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    # Get subject context if provided
    subject_context = None
    if message.subject_id:
        subject_result = await db.execute(select(Subject).where(Subject.id == message.subject_id))
        subject = subject_result.scalar_one_or_none()
        if subject:
            subject_context = subject.name
    
    # Generate AI response
    response = await ai_service.generate_response(
        message=message.message,
        subject_context=subject_context,
        grade=message.grade or profile.grade
    )
    
    return ChatResponse(
        response=response,
        sources=None  # Could be enhanced to include source references
    )

@router.post("/generate-quiz-question")
async def generate_quiz_question(
    subject: str,
    topic: str,
    grade: int,
    difficulty: str = "medium",
    current_user: User = Depends(get_current_active_user)
):
    """Generate a quiz question using AI"""
    
    question = await ai_service.generate_quiz_question(
        subject=subject,
        topic=topic,
        grade=grade,
        difficulty=difficulty
    )
    
    if not question:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate quiz question"
        )
    
    return question 