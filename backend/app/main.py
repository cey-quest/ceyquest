from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, subjects, ai_chat, quizzes, dashboard
from .database import engine
from .models import Base

# Create database tables
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app = FastAPI(
    title="CeyQuest API",
    description="AI-powered educational platform for Sri Lankan students",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(subjects.router)
app.include_router(ai_chat.router)
app.include_router(quizzes.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the CeyQuest Backend API!"}

@app.on_event("startup")
async def startup_event():
    await create_tables() 