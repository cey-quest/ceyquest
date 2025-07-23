from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from ..database import get_db
from ..models import User, Profile, QuizAttempt, Leaderboard, XPRecord
from ..schemas import DashboardStats, Leaderboard as LeaderboardSchema
from ..auth import get_current_active_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's dashboard statistics"""
    
    # Get user profile
    profile_result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = profile_result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    # Get quiz statistics
    quiz_stats_result = await db.execute(
        select(
            func.count(QuizAttempt.id).label("total_attempts"),
            func.avg(QuizAttempt.score).label("avg_score")
        ).where(QuizAttempt.user_id == current_user.id)
    )
    quiz_stats = quiz_stats_result.first()
    
    # Calculate rank in grade
    rank_result = await db.execute(
        select(func.count(Leaderboard.id) + 1)
        .where(
            Leaderboard.grade == profile.grade,
            Leaderboard.total_xp > profile.total_xp
        )
    )
    rank = rank_result.scalar()
    
    return DashboardStats(
        total_xp=profile.total_xp,
        current_streak=profile.current_streak,
        longest_streak=profile.longest_streak,
        quizzes_completed=quiz_stats.total_attempts or 0,
        average_score=float(quiz_stats.avg_score or 0),
        rank_in_grade=rank
    )

@router.get("/leaderboard", response_model=List[LeaderboardSchema])
async def get_leaderboard(
    grade: int = None,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    """Get leaderboard for a specific grade or overall"""
    
    query = select(Leaderboard).order_by(desc(Leaderboard.total_xp))
    
    if grade:
        query = query.where(Leaderboard.grade == grade)
    
    query = query.limit(limit)
    
    result = await db.execute(query)
    leaderboard = result.scalars().all()
    
    return leaderboard

@router.get("/xp-history")
async def get_xp_history(
    current_user: User = Depends(get_current_active_user),
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Get user's XP history"""
    
    result = await db.execute(
        select(XPRecord)
        .where(XPRecord.user_id == current_user.id)
        .order_by(desc(XPRecord.created_at))
        .limit(limit)
    )
    
    xp_records = result.scalars().all()
    
    return [
        {
            "id": record.id,
            "xp_amount": record.xp_amount,
            "source": record.source,
            "description": record.description,
            "created_at": record.created_at
        }
        for record in xp_records
    ]

@router.get("/recent-activity")
async def get_recent_activity(
    current_user: User = Depends(get_current_active_user),
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """Get user's recent activity (quiz attempts, XP earned)"""
    
    # Get recent quiz attempts
    quiz_attempts_result = await db.execute(
        select(QuizAttempt)
        .where(QuizAttempt.user_id == current_user.id)
        .order_by(desc(QuizAttempt.completed_at))
        .limit(limit)
    )
    
    quiz_attempts = quiz_attempts_result.scalars().all()
    
    # Get recent XP records
    xp_records_result = await db.execute(
        select(XPRecord)
        .where(XPRecord.user_id == current_user.id)
        .order_by(desc(XPRecord.created_at))
        .limit(limit)
    )
    
    xp_records = xp_records_result.scalars().all()
    
    # Combine and sort by date
    activities = []
    
    for attempt in quiz_attempts:
        activities.append({
            "type": "quiz_attempt",
            "id": attempt.id,
            "title": f"Completed quiz (Score: {attempt.score}/{attempt.total_questions})",
            "timestamp": attempt.completed_at,
            "xp_earned": calculate_quiz_xp(attempt.score, attempt.total_questions)
        })
    
    for record in xp_records:
        activities.append({
            "type": "xp_earned",
            "id": record.id,
            "title": f"Earned {record.xp_amount} XP - {record.description}",
            "timestamp": record.created_at,
            "xp_earned": record.xp_amount
        })
    
    # Sort by timestamp and return top results
    activities.sort(key=lambda x: x["timestamp"], reverse=True)
    return activities[:limit]

def calculate_quiz_xp(score: int, total_questions: int) -> int:
    """Calculate XP earned from quiz performance"""
    if total_questions == 0:
        return 0
    
    percentage = (score / total_questions) * 100
    
    if percentage >= 90:
        return 100
    elif percentage >= 80:
        return 75
    elif percentage >= 70:
        return 50
    elif percentage >= 60:
        return 25
    else:
        return 10 