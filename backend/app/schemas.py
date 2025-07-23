from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    name: str
    grade: int
    school: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Profile schemas
class ProfileBase(BaseModel):
    name: str
    grade: int
    school: Optional[str] = None
    photo_url: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    grade: Optional[int] = None
    school: Optional[str] = None
    photo_url: Optional[str] = None

class Profile(ProfileBase):
    id: int
    user_id: int
    total_xp: int
    current_streak: int
    longest_streak: int
    last_login: datetime
    
    class Config:
        from_attributes = True

# Subject schemas
class SubjectBase(BaseModel):
    name: str
    grade: int
    description: Optional[str] = None
    icon_url: Optional[str] = None

class Subject(SubjectBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True

# Resource schemas
class ResourceBase(BaseModel):
    title: str
    content: str
    resource_type: Optional[str] = None
    chapter: Optional[str] = None
    page_number: Optional[int] = None

class ResourceCreate(ResourceBase):
    subject_id: int

class Resource(ResourceBase):
    id: int
    subject_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Quiz schemas
class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    time_limit: Optional[int] = None

class QuizCreate(QuizBase):
    subject_id: int

class Quiz(QuizBase):
    id: int
    subject_id: int
    total_questions: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Quiz Question schemas
class QuizQuestionBase(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    explanation: Optional[str] = None

class QuizQuestionCreate(QuizQuestionBase):
    quiz_id: int
    correct_answer: str

class QuizQuestion(QuizQuestionBase):
    id: int
    quiz_id: int
    correct_answer: str
    
    class Config:
        from_attributes = True

# Quiz Attempt schemas
class QuizAttemptBase(BaseModel):
    quiz_id: int
    score: int
    total_questions: int
    correct_answers: int
    time_taken: Optional[int] = None

class QuizAttemptCreate(QuizAttemptBase):
    pass

class QuizAttempt(QuizAttemptBase):
    id: int
    user_id: int
    completed_at: datetime
    
    class Config:
        from_attributes = True

# XP Record schemas
class XPRecordBase(BaseModel):
    xp_amount: int
    source: str
    description: Optional[str] = None

class XPRecordCreate(XPRecordBase):
    pass

class XPRecord(XPRecordBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Leaderboard schemas
class LeaderboardBase(BaseModel):
    grade: int
    total_xp: int
    current_streak: int
    quizzes_completed: int
    average_score: float

class Leaderboard(LeaderboardBase):
    id: int
    user_id: int
    last_updated: datetime
    
    class Config:
        from_attributes = True

# Dashboard schemas
class DashboardStats(BaseModel):
    total_xp: int
    current_streak: int
    longest_streak: int
    quizzes_completed: int
    average_score: float
    rank_in_grade: Optional[int] = None

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# AI Chat schemas
class ChatMessage(BaseModel):
    message: str
    subject_id: Optional[int] = None
    grade: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    sources: Optional[List[str]] = None 