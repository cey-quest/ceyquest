# CeyQuest Backend

FastAPI backend for the CeyQuest platform - Sri Lanka's first AI-powered educational platform.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Database**: PostgreSQL with SQLAlchemy ORM
- **AI Integration**: Gemini API for CeynovX chat and quiz generation
- **Quiz System**: Timed MCQs with XP rewards
- **Dashboard**: User stats, XP tracking, leaderboards
- **Subject Resources**: Grade-specific educational content
- **CORS Support**: Configured for frontend integration

## Tech Stack

- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with asyncpg
- **ORM**: SQLAlchemy 2.0 (async)
- **Authentication**: JWT with python-jose
- **AI**: Google Gemini API
- **Password Hashing**: bcrypt
- **Validation**: Pydantic

## Setup Instructions

### 1. Prerequisites

- Python 3.9+
- PostgreSQL database
- Gemini API key

### 2. Environment Setup

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/ceyquest
JWT_SECRET_KEY=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install Dependencies

```bash
# Using Poetry (recommended)
poetry install

# Or using pip
pip install -r requirements.txt
```

### 4. Database Setup

1. Create a PostgreSQL database named `ceyquest`
2. Update the `DATABASE_URL` in your `.env` file
3. Tables will be created automatically on startup

### 5. Run the Server

```bash
# Using the run script
python run.py

# Or using uvicorn directly
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update user profile

### Subjects & Resources
- `GET /subjects/` - Get all subjects (filter by grade)
- `GET /subjects/{id}` - Get specific subject
- `GET /subjects/{id}/resources` - Get subject resources
- `GET /subjects/resources/{id}` - Get specific resource

### AI Chat (CeynovX)
- `POST /ai/chat` - Chat with CeynovX AI
- `POST /ai/generate-quiz-question` - Generate quiz question

### Quizzes
- `GET /quizzes/` - Get all quizzes (filter by subject)
- `GET /quizzes/{id}` - Get specific quiz
- `GET /quizzes/{id}/questions` - Get quiz questions
- `POST /quizzes/{id}/submit` - Submit quiz attempt
- `GET /quizzes/attempts/my` - Get user's quiz attempts

### Dashboard
- `GET /dashboard/stats` - Get user dashboard stats
- `GET /dashboard/leaderboard` - Get leaderboard
- `GET /dashboard/xp-history` - Get XP history
- `GET /dashboard/recent-activity` - Get recent activity

## Database Models

- **User**: Authentication and basic user info
- **Profile**: User profile with XP, streaks, grade info
- **Subject**: Educational subjects by grade
- **Resource**: Subject-specific educational content
- **Quiz**: Quiz definitions and metadata
- **QuizQuestion**: Individual quiz questions
- **QuizAttempt**: User quiz attempts and scores
- **XPRecord**: XP earning history
- **Leaderboard**: User rankings and stats

## Development

### Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app entry point
│   ├── config.py        # Environment configuration
│   ├── database.py      # Database connection
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── auth.py          # Authentication utilities
│   ├── ai_service.py    # Gemini AI integration
│   └── routers/         # API route modules
│       ├── auth.py
│       ├── subjects.py
│       ├── ai_chat.py
│       ├── quizzes.py
│       └── dashboard.py
├── pyproject.toml       # Poetry dependencies
├── run.py              # Development server script
└── README.md
```

### Adding New Features

1. Create models in `app/models.py`
2. Add schemas in `app/schemas.py`
3. Create router in `app/routers/`
4. Include router in `app/main.py`

## Production Deployment

For production deployment:

1. Set up a production PostgreSQL database
2. Configure environment variables for production
3. Use a production ASGI server (Gunicorn + Uvicorn)
4. Set up reverse proxy (Nginx)
5. Configure SSL certificates
6. Set up monitoring and logging

## Security Notes

- JWT tokens expire after 30 minutes
- Passwords are hashed using bcrypt
- CORS is configured for specific origins
- Database connections use asyncpg for performance
- API keys are stored in environment variables

## Support

For issues and questions, please refer to the main CeyQuest project documentation. 