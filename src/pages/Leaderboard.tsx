import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Star, TrendingUp } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { LeaderboardEntry, Student } from '@/types';

const Leaderboard = () => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number>(6);

  useEffect(() => {
    document.title = '-leaderboard';
  }, []);

  useEffect(() => {
    const savedStudent = localStorage.getItem('ceyquest-student');
    let leaderboardData: LeaderboardEntry[] = [];
    let grade = 6;
    if (savedStudent) {
      const studentData = JSON.parse(savedStudent);
      grade = parseInt(studentData.grade) || 6;
      setCurrentStudent({
        ...studentData,
        id: '1',
        xpPoints: 5777,
        rank: 1,
        name: 'Anoof MA',
        dayStreak: 20,
        grade: 6,
      });
      setSelectedGrade(grade);
      // Set Anoof MA as top rank
      leaderboardData = [
        {
          position: 1,
          xpPoints: 5777,
          student: {
            id: '1',
            name: 'Anoof MA',
            grade: 6,
            xpPoints: 5777,
            rank: 1,
            subjects: [],
            completedQuizzes: 12,
            totalQuizzes: 50,
            dayStreak: 20,
          },
          recentActivity: 'Completed Quiz: Science',
        },
        {
          student: {
            id: '2',
            name: 'Kavitha Fernando',
            grade,
            xpPoints: 2720,
            rank: 2,
            subjects: [],
            completedQuizzes: 42,
            totalQuizzes: 50
          },
          position: 2,
          xpPoints: 2720,
          recentActivity: 'Mastered Science - Atoms & Molecules'
        },
        {
          student: {
            id: '3',
            name: 'Ravindu Silva',
            grade,
            xpPoints: 2650,
            rank: 3,
            subjects: [],
            completedQuizzes: 40,
            totalQuizzes: 50
          },
          position: 3,
          xpPoints: 2650,
          recentActivity: 'Perfect score in English Literature'
        },
        // Add more mock students
        ...Array.from({ length: 12 }, (_, i) => ({
          student: {
            id: `${i + 4}`,
            name: `Student ${i + 4}`,
            grade,
            xpPoints: 2600 - (i * 50),
            rank: i + 4,
            subjects: [],
            completedQuizzes: 35 - i,
            totalQuizzes: 50
          },
          position: i + 4,
          xpPoints: 2600 - (i * 50),
          recentActivity: 'Recent activity...'
        }))
      ];
    }
    setLeaderboard(leaderboardData);
  }, [selectedGrade]);

  const generateMockLeaderboard = (grade: number) => {
    const mockStudents: LeaderboardEntry[] = [
      {
        student: {
          id: '1',
          name: 'Sahan Perera',
          grade,
          xpPoints: 2850,
          rank: 1,
          subjects: [],
          completedQuizzes: 45,
          totalQuizzes: 50
        },
        position: 1,
        xpPoints: 2850,
        recentActivity: 'Completed Mathematics Quiz - Chapter 5'
      },
      {
        student: {
          id: '2',
          name: 'Kavitha Fernando',
          grade,
          xpPoints: 2720,
          rank: 2,
          subjects: [],
          completedQuizzes: 42,
          totalQuizzes: 50
        },
        position: 2,
        xpPoints: 2720,
        recentActivity: 'Mastered Science - Atoms & Molecules'
      },
      {
        student: {
          id: '3',
          name: 'Ravindu Silva',
          grade,
          xpPoints: 2650,
          rank: 3,
          subjects: [],
          completedQuizzes: 40,
          totalQuizzes: 50
        },
        position: 3,
        xpPoints: 2650,
        recentActivity: 'Perfect score in English Literature'
      },
      // Add more mock students
      ...Array.from({ length: 12 }, (_, i) => ({
        student: {
          id: `${i + 4}`,
          name: `Student ${i + 4}`,
          grade,
          xpPoints: 2600 - (i * 50),
          rank: i + 4,
          subjects: [],
          completedQuizzes: 35 - i,
          totalQuizzes: 50
        },
        position: i + 4,
        xpPoints: 2600 - (i * 50),
        recentActivity: 'Recent activity...'
      }))
    ];

    // If current student exists, insert them at position 15
    if (currentStudent) {
      mockStudents.push({
        student: currentStudent,
        position: 15,
        xpPoints: currentStudent.xpPoints,
        recentActivity: 'Completed Quiz - Chapter 3'
      });
    }

    setLeaderboard(mockStudents);
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{position}</span>;
    }
  };

  const getRankBadgeVariant = (position: number) => {
    if (position <= 3) return "default";
    if (position <= 10) return "secondary";
    return "outline";
  };

  // Mock stats for header
  const totalRegistered = 1277;
  const totalParticipated = 255;

  return (
    <Layout>
      <div className="space-y-8 px-[30px]">
        {/* Header */}
        <div className="flex items-center mb-4">
          <span className="block w-8 h-1 bg-white mr-4 rounded" />
          <h1 className="font-bold text-white" style={{ fontSize: '18px', fontFamily: 'Inter, sans-serif' }}>Leaderboard</h1>
        </div>
        {/* Stats Row */}
        <div className="w-full flex justify-center">
          <div className="w-full md:w-[90%] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 items-center">
              <Card className="bg-[#23272f] rounded-xl p-6 flex items-center gap-4 shadow-md w-[90%] mx-auto">
                <div className="bg-green-500/20 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5m6 0v-6m0 0V4m0 10a4 4 0 01-4-4V4a4 4 0 018 0v6a4 4 0 01-4 4z" /></svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{totalRegistered}</div>
                  <div className="text-sm text-gray-400">Total Registered</div>
                </div>
              </Card>
              {currentStudent && (
                <Card className="bg-white/24 text-white shadow-glow w-[135%] max-w-full mx-auto h-fit flex flex-col justify-center">
                  <CardContent className="p-3 flex flex-col justify-center">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-3 bg-white/10 rounded-xl px-3 py-2">
                        <Avatar className="h-16 w-16 border-2 border-white">
                          {currentStudent.photo ? (
                            <img src={currentStudent.photo} alt={currentStudent.name} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <AvatarFallback className="bg-white text-primary text-lg font-bold">
                              {currentStudent.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold">{currentStudent.name}</h3>
                          <p className="text-white/80">Your Current Position</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold">#{currentStudent.rank}</div>
                        <div className="flex items-center gap-1 text-white/80">
                          <Star className="h-4 w-4" />
                          {currentStudent.xpPoints} XP
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Card className="bg-[#23272f] rounded-xl p-6 flex items-center gap-4 shadow-md w-[90%] mx-auto">
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5m6 0v-6m0 0V4m0 10a4 4 0 01-4-4V4a4 4 0 018 0v6a4 4 0 01-4 4z" /></svg>
                  </div>
                <div>
                  <div className="text-2xl font-bold text-white">{totalParticipated}</div>
                  <div className="text-sm text-gray-400">Total Participated</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
        {/* Top 3 Podium Cards */}
        <div className="w-full flex justify-center">
          <div className="w-full md:w-[80%] mx-auto">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {leaderboard.slice(0, 3).map((entry, index) => (
                <Card
                  key={entry.student.id}
                  className={`shadow-lg relative bg-[#23272f] ${
                    index === 0 ? 'md:w-[50%] flex flex-row items-center justify-center' : 'rounded-2xl md:w-[25%] flex flex-col items-center p-6'
                  }`}
                >
                  {index === 0 ? (
                    <>
                      <div className="flex-shrink-0 w-1/2 max-w-[220px] min-w-[120px] aspect-square overflow-hidden rounded-2xl">
                        {entry.student.photo ? (
                          <img src={entry.student.photo} alt={entry.student.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white text-primary text-4xl font-bold">
                            {entry.student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 pl-12 flex flex-col justify-center items-center text-center">
                        <h3 className="font-bold text-2xl text-white mb-2">{entry.student.name}</h3>
                        <div className="flex flex-col gap-1 mb-2">
                          <span className="text-xs text-gray-400 font-semibold">Quizzes</span>
                          <div className="flex gap-4 items-center">
                            <span className="text-white text-base font-bold">{entry.student.completedQuizzes ?? 0}</span>
                            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                              <span role="img" aria-label="badge">🏅</span> {entry.student.badges ?? 0} Badges
                            </span>
                            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                              <span role="img" aria-label="rank">#</span> {entry.student.rank}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3 items-center">
                          <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                            <span role="img" aria-label="fire">🔥</span> day streaks
                          </span>
                          <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                            <span role="img" aria-label="gem">💎</span> {entry.xpPoints} XP
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Avatar className="h-20 w-20 border-4 border-white mb-3">
                        {entry.student.photo ? (
                          <img src={entry.student.photo} alt={entry.student.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <AvatarFallback className="bg-white text-primary text-2xl font-bold">
                            {entry.student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <h3 className="font-bold text-xl text-white mb-2">{entry.student.name}</h3>
                      <div className="flex flex-col gap-1 mb-2">
                        <span className="text-xs text-gray-400 font-semibold">Quizzes</span>
                        <div className="flex gap-4 items-center">
                          <span className="text-white text-base font-bold">{entry.student.completedQuizzes ?? 0}</span>
                          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <span role="img" aria-label="badge">🏅</span> {entry.student.badges ?? 0} Badges
                          </span>
                          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <span role="img" aria-label="rank">#</span> {entry.student.rank}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                          <span role="img" aria-label="fire">🔥</span> day streaks
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                          <span role="img" aria-label="gem">💎</span> {entry.xpPoints} XP
                        </span>
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
        {/* Student Cards Grid (left of global ranking, under podium) */}
        <div className="w-full flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaderboard.filter(entry => entry.student.grade >= 6 && entry.student.grade <= 11).map((entry) => {
                const completion = entry.student.totalQuizzes ? Math.round((entry.student.completedQuizzes / entry.student.totalQuizzes) * 100) : 0;
                return (
                  <div key={entry.student.id} className="bg-[#23272f] rounded-2xl shadow-lg p-0 flex flex-col items-stretch justify-between min-h-[220px] text-white overflow-hidden">
                    <div className="w-full aspect-square flex-shrink-0">
                      {entry.student.photo ? (
                        <img src={entry.student.photo} alt={entry.student.name} className="w-full h-full object-cover" style={{ borderRadius: 0 }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-primary text-4xl font-bold" style={{ borderRadius: 0 }}>
                          {entry.student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2 mt-auto pt-4 border-t border-white/10">
                      <div className="font-bold text-lg text-white">{entry.student.name}</div>
                      <div className="text-xs text-gray-300">Grade {entry.student.grade}</div>
                    </div>
                    <div className="flex w-full justify-between items-center mt-2 gap-2 px-4 pb-4">
                      <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                        <span role="img" aria-label="gem">💎</span> {entry.student.xpPoints} XP
                      </span>
                      <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold">
                        <span role="img" aria-label="quiz">📝</span> {entry.student.completedQuizzes} Quizzes
                      </span>
                      <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold">
                        <span role="img" aria-label="completion">✔️</span> {completion}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Global Ranking List (right) */}
          <div className="w-full md:w-[30%] mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Global Ranking</h2>
            <div className="flex flex-col gap-6">
              {leaderboard.map((entry, idx) => (
                <div
                  key={entry.student.id}
                  className={`flex items-center justify-between px-6 py-4 rounded-full shadow-lg transition-all duration-200 bg-white/20 backdrop-blur
                    ${idx === 0 ? 'border-2 border-purple-500'
                      : idx === 1 ? 'border-2 border-green-500'
                      : idx === 2 ? 'border-2 border-blue-500'
                      : 'border border-[#23272f]/40'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    {entry.position > 3 && (
                      <span className="font-bold text-gray-400 text-lg">#{entry.position}</span>
                    )}
                    {idx === 0 && (
                      <span className="text-yellow-400"><Trophy className="w-7 h-7" fill="#facc15" /></span>
                    )}
                    {idx === 1 && (
                      <span className="text-gray-400"><Trophy className="w-7 h-7" fill="#d1d5db" /></span>
                    )}
                    {idx === 2 && (
                      <span className="text-orange-400"><Trophy className="w-7 h-7" fill="#fb923c" /></span>
                    )}
                    <Avatar className="h-14 w-14">
                      {entry.student.photo ? (
                        <img src={entry.student.photo} alt={entry.student.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <AvatarFallback className="bg-white text-primary text-xl font-bold">
                          {entry.student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className={`font-bold ${idx === 0 ? 'text-purple-500 text-lg' : idx === 1 ? 'text-green-500 text-lg' : idx === 2 ? 'text-blue-500 text-lg' : 'text-white text-base'}`}>{entry.student.name}</div>
                      <div className="text-xs text-gray-400">Level {Math.floor((entry.student.xpPoints || 0) / 1200) + 1}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-6 py-2 rounded-full text-base font-bold">
                      <span role="img" aria-label="gem">💎</span> {entry.xpPoints} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;