import httpx
from typing import Optional, List
from .config import settings

class GeminiAIService:
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    
    async def generate_response(
        self, 
        message: str, 
        subject_context: Optional[str] = None,
        grade: Optional[int] = None
    ) -> str:
        """
        Generate AI response for CeynovX chat
        """
        try:
            # Build context-aware prompt
            context_prompt = self._build_context_prompt(message, subject_context, grade)
            
            # Prepare request payload
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": context_prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 1024,
                }
            }
            
            # Make API request
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}?key={self.api_key}",
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if "candidates" in result and len(result["candidates"]) > 0:
                        content = result["candidates"][0]["content"]
                        if "parts" in content and len(content["parts"]) > 0:
                            return content["parts"][0]["text"]
                
                # Fallback response
                return "I'm sorry, I couldn't process your request at the moment. Please try again."
                
        except Exception as e:
            print(f"Error in Gemini AI service: {e}")
            return "I'm experiencing technical difficulties. Please try again later."
    
    def _build_context_prompt(self, message: str, subject: Optional[str] = None, grade: Optional[int] = None) -> str:
        """
        Build a context-aware prompt for educational responses
        """
        base_prompt = """You are CeynovX, an AI educational assistant for Sri Lankan students. 
        You help students understand their school subjects and provide clear, accurate explanations.
        
        Guidelines:
        - Provide clear, step-by-step explanations
        - Use simple language appropriate for school students
        - Include relevant examples when helpful
        - Focus on the Sri Lankan curriculum context
        - Be encouraging and supportive
        - If you're not sure about something, say so rather than guessing
        
        Student's question: """
        
        if subject:
            base_prompt += f"\nSubject context: {subject}"
        
        if grade:
            base_prompt += f"\nGrade level: {grade}"
        
        base_prompt += f"\n\nQuestion: {message}\n\nPlease provide a helpful response:"
        
        return base_prompt
    
    async def generate_quiz_question(
        self, 
        subject: str, 
        topic: str, 
        grade: int,
        difficulty: str = "medium"
    ) -> Optional[dict]:
        """
        Generate a quiz question using AI
        """
        try:
            prompt = f"""Generate a multiple choice question for a {grade}th grade {subject} student about {topic}.
            
            Difficulty level: {difficulty}
            
            Please provide the response in this exact format:
            {{
                "question": "The question text here?",
                "options": {{
                    "A": "Option A text",
                    "B": "Option B text", 
                    "C": "Option C text",
                    "D": "Option D text"
                }},
                "correct_answer": "A",
                "explanation": "Brief explanation of why this is correct"
            }}
            
            Make sure the question is appropriate for {grade}th grade level and follows the Sri Lankan curriculum."""
            
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.8,
                    "maxOutputTokens": 512,
                }
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}?key={self.api_key}",
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if "candidates" in result and len(result["candidates"]) > 0:
                        content = result["candidates"][0]["content"]
                        if "parts" in content and len(content["parts"]) > 0:
                            # Try to parse the response as JSON
                            import json
                            try:
                                return json.loads(content["parts"][0]["text"])
                            except json.JSONDecodeError:
                                return None
                
                return None
                
        except Exception as e:
            print(f"Error generating quiz question: {e}")
            return None

# Global instance
ai_service = GeminiAIService() 