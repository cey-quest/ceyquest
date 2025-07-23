import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, BookOpen, TrendingUp, Award } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Student } from '@/types';

const Dashboard = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState(65);
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    const savedStudent = localStorage.getItem('ceyquest-student');
    if (savedStudent) {
      const studentData = JSON.parse(savedStudent);
      setStudent({
        ...studentData,
        id: '1',
        xpPoints: studentData.xpPoints || 1250,
        rank: studentData.rank || 15,
        completedQuizzes: studentData.completedQuizzes || 12,
        totalQuizzes: studentData.totalQuizzes || 50,
        photo: studentData.photo || '',
        grade: studentData.grade || 7,
        name: studentData.name || 'Anoof',
      });
    }
  }, []);

  if (!student) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </Layout>
    );
  }

  // Calculate level from XP (e.g., every 1200 XP is a new level)
  const level = Math.floor((student?.xpPoints || 0) / 1200) + 1;
  const xpToNextLevel = 1200;
  const xpThisLevel = (student?.xpPoints || 0) % 1200;
  const xpPercent = Math.min(100, Math.round((xpThisLevel / xpToNextLevel) * 100));

  // Example subject progress
  const subjectProgress = [
    { name: 'Mathematics', value: 91 },
    { name: 'Science', value: 85 },
    { name: 'English', value: 96 },
    { name: 'Sinhala', value: 87 },
  ];

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto py-8 px-2 grid grid-cols-12 auto-rows-min gap-6">
        {/* Header Row: Welcome + XP/Level Card */}
        <div className="col-span-12 flex flex-row items-center justify-between gap-8 mb-2 h-fit">
          <h1 className="text-[3.5rem] font-extrabold text-white drop-shadow-lg" style={{ fontFamily: 'Foda Display, sans-serif' }}>
            Welcome, {student.name}
          </h1>
          {/* XP/Level Card */}
          <Card className="flex flex-col justify-center bg-gradient-to-br from-[#2d1a4a]/80 to-[#a259ff]/60 rounded-2xl shadow-xl p-6 text-right text-white h-fit transition-all duration-300 hover:shadow-[0_0_32px_8px_rgba(162,89,255,0.4)] hover:scale-105 cursor-pointer min-w-[320px]">
            <div className="flex flex-row justify-end items-center gap-8">
              <div className="flex flex-col items-end">
                <div className="text-2xl font-bold">{student.xpPoints} XP</div>
                <div className="text-sm opacity-80 mb-2">Level {level}</div>
                {/* XP Progress Bar */}
                <div className="w-40 h-2 bg-white/20 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-gradient-to-r from-[#a259ff] to-[#6a1b9a]" style={{ width: `${xpPercent}%` }} />
                </div>
                <span className="text-xs text-white/70">{xpThisLevel}/1200 XP to next level</span>
              </div>
              <div className="flex gap-2">
                <span className="inline-block bg-yellow-400/80 rounded-full px-3 py-1 text-lg font-bold text-black">Level {level}</span>
              </div>
            </div>
          </Card>
        </div>
        {/* Profile Card 1:1 */}
        <Card className="col-span-3 flex flex-col justify-end bg-gradient-to-br from-[#2d1a4a]/80 to-[#a259ff]/60 rounded-2xl shadow-xl p-0 aspect-square h-fit min-h-0 overflow-hidden relative">
          {student && (student as any).photo ? (
            <img src={(student as any).photo} alt="Profile" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center text-4xl bg-gray-200 text-gray-500 rounded-2xl">?</div>
          )}
          {/* Blurred frame/bar at the bottom */}
          <div className="absolute bottom-0 left-0 w-full px-4 py-3 flex items-center gap-2 backdrop-blur-md bg-black/40 rounded-b-2xl">
            <span className="text-white font-semibold text-lg truncate">{student.name}</span>
            <Badge className="bg-gradient-to-r from-[#a259ff] to-[#6a1b9a] text-white px-3 py-1 rounded-full text-xs">Student</Badge>
          </div>
        </Card>
        {/* Weekly Progress 1:1 */}
        <Card className="col-span-3 flex flex-col justify-center bg-[#18141f]/80 rounded-2xl shadow-xl p-6 aspect-square h-fit min-h-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#a259ff] text-xl font-bold">
              <TrendingUp className="h-5 w-5" /> Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm text-white/80">
                <span>This week's learning goal</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="h-3 bg-[#2d1a4a]" style={{ background: '#2d1a4a' }} />
              <div className="flex justify-between text-xs text-purple-300 mt-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Subject Progress 1:1 */}
        <Card className="col-span-3 flex flex-col justify-center bg-[#18141f]/80 rounded-2xl shadow-xl p-6 aspect-square h-fit min-h-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#a259ff] text-xl font-bold">
              <BookOpen className="h-5 w-5" /> Subject Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjectProgress.map((subject) => (
                <div key={subject.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/90">{subject.name}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={subject.value} className="w-24 h-2 bg-[#2d1a4a]" style={{ background: '#2d1a4a' }} />
                    <span className="text-sm text-purple-300">{subject.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Leaderboard Rank Card */}
        <Card className="col-span-3 row-span-2 flex flex-col justify-center bg-gradient-to-br from-[#18141f]/90 to-[#2d1a4a]/80 rounded-2xl shadow-xl p-8 h-fit min-h-0">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-4">
              <Trophy className="h-10 w-10 text-yellow-400" />
              <span className="text-2xl font-bold text-white">RANK #{student.rank}</span>
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="flex items-center gap-2 bg-[#232136] rounded-lg p-2">
                <img src={(student as any).photo || ''} alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                <span className="text-white font-bold">{student.name}</span>
                <Badge className="bg-yellow-400 text-black ml-auto">RANK {student.rank}</Badge>
              </div>
              <div className="flex items-center gap-2 bg-[#232136] rounded-lg p-2">
                <span className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">KF</span>
                <span className="text-white font-bold">Kavitha Fernando</span>
                <Badge className="bg-white/10 text-white ml-auto">RANK 2</Badge>
              </div>
              <div className="flex items-center gap-2 bg-[#232136] rounded-lg p-2">
                <span className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">RS</span>
                <span className="text-white font-bold">Ravindu Silva</span>
                <Badge className="bg-white/10 text-white ml-auto">RANK 1</Badge>
              </div>
            </div>
          </div>
        </Card>
        {/* Achievements Card under progress cards */}
        <Card className="col-span-6 flex flex-col justify-center bg-[#18141f]/80 rounded-[2rem] shadow-xl p-8 h-fit min-h-0 relative overflow-hidden group" style={{ borderRadius: '2rem' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#a259ff]/20 to-[#18141f]/60 blur-xl opacity-60 pointer-events-none z-0" />
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-purple-300 mb-4">Badges You Got</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Badge 1 */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#a259ff]/30 to-[#6a1b9a]/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_4px_rgba(162,89,255,0.3)] cursor-pointer group/ach1" title="Awarded for completing 10 quizzes!">
                <Trophy className="h-6 w-6 text-yellow-400 drop-shadow-glow animate-bounce group-hover/ach1:animate-none" />
                <div>
                  <p className="font-medium text-white">Quiz Master</p>
                  <p className="text-xs text-white/70">Completed 10 quizzes</p>
                </div>
              </div>
              {/* Badge 2 */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#a259ff]/30 to-[#6a1b9a]/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_4px_rgba(162,89,255,0.3)] cursor-pointer group/ach2" title="7-day study streak!">
                <Star className="h-6 w-6 text-purple-300 drop-shadow-glow animate-pulse group-hover/ach2:animate-none" />
                <div>
                  <p className="font-medium text-white">Week Warrior</p>
                  <p className="text-xs text-white/70">7-day study streak</p>
                </div>
              </div>
              {/* Badge 3 */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#a259ff]/30 to-[#6a1b9a]/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_4px_rgba(162,89,255,0.3)] cursor-pointer group/ach3" title="100% in Mathematics!">
                <Target className="h-6 w-6 text-green-400 drop-shadow-glow animate-spin-slow group-hover/ach3:animate-none" />
                <div>
                  <p className="font-medium text-white">Math Champion</p>
                  <p className="text-xs text-white/70">100% in Mathematics</p>
                </div>
              </div>
              {/* Badge 4 */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f246ff]/30 to-[#a259ff]/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_4px_rgba(242,70,255,0.3)] cursor-pointer group/ach4" title="Completed all Science quizzes!">
                <BookOpen className="h-6 w-6 text-cyan-300 drop-shadow-glow" />
                <div>
                  <p className="font-medium text-white">Science Star</p>
                  <p className="text-xs text-white/70">All Science quizzes done</p>
                </div>
              </div>
              {/* Badge 5 */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#ffb347]/30 to-[#a259ff]/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_4px_rgba(255,179,71,0.3)] cursor-pointer group/ach5" title="Perfect attendance for a month!">
                <Award className="h-6 w-6 text-orange-300 drop-shadow-glow" />
                <div>
                  <p className="font-medium text-white">Attendance Ace</p>
                  <p className="text-xs text-white/70">Perfect attendance</p>
                </div>
              </div>
              {/* Badge 6 */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#a259ff]/30 to-[#f246ff]/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_4px_rgba(162,89,255,0.3)] cursor-pointer group/ach6" title="Shared your first note!">
                <Star className="h-6 w-6 text-pink-400 drop-shadow-glow" />
                <div>
                  <p className="font-medium text-white">Note Sharer</p>
                  <p className="text-xs text-white/70">Shared your first note</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;