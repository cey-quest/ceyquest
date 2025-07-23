from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from ..database import get_db
from ..models import Quiz, QuizQuestion, QuizAttempt, User, Profile, XPRecord
from ..schemas import Quiz as QuizSchema, QuizQuestion as QuizQuestionSchema, QuizAttempt as QuizAttemptSchema, QuizAttemptCreate
from ..auth import get_current_active_user

router = APIRouter(prefix="/quizzes", tags=["quizzes"])

@router.get("/", response_model=List[QuizSchema])
async def get_quizzes(
    subject_id: int = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all quizzes, optionally filtered by subject"""
    query = select(Quiz).where(Quiz.is_active == True)
    
    if subject_id:
        query = query.where(Quiz.subject_id == subject_id)
    
    result = await db.execute(query)
    quizzes = result.scalars().all()
    
    return quizzes

@router.get("/{quiz_id}", response_model=QuizSchema)
async def get_quiz(quiz_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific quiz by ID"""
    result = await db.execute(select(Quiz).where(Quiz.id == quiz_id))
    quiz = result.scalar_one_or_none()
    
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    return quiz

@router.get("/{quiz_id}/questions", response_model=List[QuizQuestionSchema])
async def get_quiz_questions(
    quiz_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get all questions for a specific quiz (without correct answers)"""
    # First check if quiz exists
    quiz_result = await db.execute(select(Quiz).where(Quiz.id == quiz_id))
    quiz = quiz_result.scalar_one_or_none()
    
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    # Get questions without correct answers
    result = await db.execute(
        select(
            QuizQuestion.id,
            QuizQuestion.quiz_id,
            QuizQuestion.question_text,
            QuizQuestion.option_a,
            QuizQuestion.option_b,
            QuizQuestion.option_c,
            QuizQuestion.option_d
        ).where(QuizQuestion.quiz_id == quiz_id)
    )
    
    questions = result.all()
    return [
        QuizQuestionSchema(
            id=q.id,
            quiz_id=q.quiz_id,
            question_text=q.question_text,
            option_a=q.option_a,
            option_b=q.option_b,
            option_c=q.option_c,
            option_d=q.option_d,
            explanation=None  # Don't include explanation in questions
        )
        for q in questions
    ]

@router.post("/{quiz_id}/submit", response_model=QuizAttemptSchema)
async def submit_quiz_attempt(
    quiz_id: int,
    attempt_data: QuizAttemptCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Submit a quiz attempt and calculate score"""
    
    # Verify quiz exists
    quiz_result = await db.execute(select(Quiz).where(Quiz.id == quiz_id))
    quiz = quiz_result.scalar_one_or_none()
    
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    # Create quiz attempt
    quiz_attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz_id,
        score=attempt_data.score,
        total_questions=attempt_data.total_questions,
        correct_answers=attempt_data.correct_answers,
        time_taken=attempt_data.time_taken
    )
    
    db.add(quiz_attempt)
    await db.commit()
    await db.refresh(quiz_attempt)
    
    # Calculate and award XP
    xp_earned = calculate_quiz_xp(attempt_data.score, attempt_data.total_questions)
    
    # Add XP record
    xp_record = XPRecord(
        user_id=current_user.id,
        xp_amount=xp_earned,
        source="quiz",
        description=f"Completed quiz: {quiz.title}"
    )
    
    db.add(xp_record)
    
    # Update user profile
    profile_result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = profile_result.scalar_one_or_none()
    
    if profile:
        profile.total_xp += xp_earned
        # Update streak logic could be added here
    
    await db.commit()
    
    return quiz_attempt

@router.get("/attempts/my", response_model=List[QuizAttemptSchema])
async def get_my_quiz_attempts(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's quiz attempts"""
    result = await db.execute(
        select(QuizAttempt).where(QuizAttempt.user_id == current_user.id)
        .order_by(QuizAttempt.completed_at.desc())
    )
    attempts = result.scalars().all()
    
    return attempts

def calculate_quiz_xp(score: int, total_questions: int) -> int:
    """Calculate XP earned from quiz performance"""
    if total_questions == 0:
        return 0
    
    percentage = (score / total_questions) * 100
    
    # Base XP calculation
    if percentage >= 90:
        return 100  # Excellent
    elif percentage >= 80:
        return 75   # Good
    elif percentage >= 70:
        return 50   # Average
    elif percentage >= 60:
        return 25   # Below average
    else:
        return 10   # Poor (participation points) 