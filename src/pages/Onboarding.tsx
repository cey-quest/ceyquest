import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import studentCharacter from '@/assets/student-character.png';
import heroBg from '@/assets/hero_bg.png';

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    email: '',
    school: ''
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.grade) {
      toast({
        title: "Please fill in required fields",
        description: "Name and Grade are required to continue.",
        variant: "destructive"
      });
      return;
    }

    // Store user data in localStorage (in a real app, this would be in a database)
    localStorage.setItem('ceyquest-student', JSON.stringify({
      ...formData,
      xpPoints: 0,
      rank: 0,
      subjects: getSubjectsByGrade(parseInt(formData.grade)),
      completedQuizzes: 0,
      totalQuizzes: 50
    }));

    toast({
      title: "Welcome to CeyQuest!",
      description: "Your profile has been created successfully.",
    });

    navigate('/dashboard');
  };

  const getSubjectsByGrade = (grade: number) => {
    const commonSubjects = ['Mathematics', 'Science', 'English', 'Sinhala'];
    
    if (grade >= 6 && grade <= 9) {
      return [...commonSubjects, 'History', 'Geography', 'Buddhism', 'Health & Physical Education'];
    } else if (grade >= 10 && grade <= 11) {
      return [...commonSubjects, 'History', 'Geography', 'Buddhism', 'ICT', 'Art'];
    } else if (grade >= 12 && grade <= 13) {
      return ['Combined Mathematics', 'Physics', 'Chemistry', 'Biology', 'ICT', 'Economics', 'Accounting'];
    }
    
    return commonSubjects;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="flex flex-col md:flex-row items-start justify-center gap-12 w-full max-w-6xl mx-auto">
        {/* Left: Student Card */}
        <div className="flex flex-col items-center">
          <div className="relative bg-gradient-to-br from-[#2d1a4a] to-[#4b2067] rounded-3xl shadow-2xl p-8 flex flex-col items-center max-w-md mx-auto">
            <img src={studentCharacter} alt="Student Character" className="w-96 h-96 object-contain mb-4" />
            <div className="text-center text-white font-bold text-3xl">Anoof MA</div>
            <div className="text-center text-white text-xl font-mono mt-2">Rank 07 <span className="text-purple-300">1000xp</span></div>
            <div className="text-center text-white/70 text-sm mt-1">60 Days Streak</div>
          </div>
        </div>
        {/* Right: Form Card */}
        <div className="w-full max-w-md">
          <div className="rounded-2xl p-8 shadow-2xl border-2 border-transparent bg-gradient-to-br from-[#2d1a4a] to-[#4b2067] relative"
               style={{ borderImage: 'linear-gradient(90deg, #a259ff, #f246ff) 1' }}>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Setup Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="grade">Grade *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 8 }, (_, i) => i + 6).map((grade) => (
                        <SelectItem key={grade} value={grade.toString()}>
                          Grade {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="school">School (Optional)</Label>
                  <Input
                    id="school"
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    placeholder="Enter your school name"
                    className="mt-1"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-elevated transition-all"
                >
                  Start Learning Journey
                </Button>
              </form>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;