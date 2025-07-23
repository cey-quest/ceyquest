import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding
    const savedStudent = localStorage.getItem('ceyquest-student');
    
    if (savedStudent) {
      // User exists, redirect to dashboard
      navigate('/dashboard');
    } else {
      // New user, redirect to onboarding
      navigate('/onboarding');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
      <div className="text-center text-white">
        <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">C</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">CeyQuest</h1>
        <p className="text-white/80">Loading your learning journey...</p>
      </div>
    </div>
  );
};

export default Index;
