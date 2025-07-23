import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Star,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  ChevronRight
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Student, Quiz as QuizType, Question } from '@/types';

const Quiz = () => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<QuizType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const savedStudent = localStorage.getItem('ceyquest-student');
    if (savedStudent) {
      const studentData = JSON.parse(savedStudent);
      setCurrentStudent(studentData);
      generateQuizzes(parseInt(studentData.grade));
    }
  }, []);

  const generateQuizzes = (grade: number) => {
    const subjects = getSubjectsByGrade(grade);
    const generatedQuizzes: QuizType[] = [];

    subjects.forEach((subject, subjectIndex) => {
      // Generate 3 quizzes per subject
      for (let i = 0; i < 3; i++) {
        const quiz: QuizType = {
          id: `quiz-${subjectIndex}-${i}`,
          title: `${subject} - Chapter ${i + 1} Quiz`,
          subjectId: `subject-${subjectIndex}`,
          questions: generateQuestions(subject, i + 1),
          timeLimit: 15, // 15 minutes
          totalPoints: 100,
          isCompleted: Math.random() > 0.7 // 30% chance of being completed
        };
        
        if (quiz.isCompleted) {
          quiz.score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
        }
        
        generatedQuizzes.push(quiz);
      }
    });

    setQuizzes(generatedQuizzes);
  };

  const getSubjectsByGrade = (grade: number): string[] => {
    if (grade >= 6 && grade <= 9) {
      return ['Mathematics', 'Science', 'English', 'Sinhala'];
    } else if (grade >= 10 && grade <= 11) {
      return ['Mathematics', 'Science', 'English', 'ICT'];
    } else if (grade >= 12 && grade <= 13) {
      return ['Combined Mathematics', 'Physics', 'Chemistry', 'Biology'];
    }
    return ['Mathematics', 'Science', 'English', 'Sinhala'];
  };

  const generateQuestions = (subject: string, chapter: number): Question[] => {
    const questionTemplates: { [key: string]: any[] } = {
      'Mathematics': [
        {
          question: 'What is the result of 15 + 27?',
          options: ['42', '41', '43', '40'],
          correctAnswer: 0,
          difficulty: 'easy',
          explanation: '15 + 27 = 42'
        },
        {
          question: 'Solve for x: 2x + 8 = 20',
          options: ['x = 4', 'x = 6', 'x = 8', 'x = 10'],
          correctAnswer: 1,
          difficulty: 'medium',
          explanation: '2x = 20 - 8, 2x = 12, x = 6'
        }
      ],
      'Science': [
        {
          question: 'What is the chemical symbol for water?',
          options: ['H2O', 'CO2', 'O2', 'H2'],
          correctAnswer: 0,
          difficulty: 'easy',
          explanation: 'Water consists of 2 hydrogen atoms and 1 oxygen atom'
        },
        {
          question: 'What is photosynthesis?',
          options: ['Converting light to chemical energy', 'Converting food to energy', 'Breathing process', 'Water absorption'],
          correctAnswer: 0,
          difficulty: 'medium',
          explanation: 'Photosynthesis converts light energy into chemical energy in plants'
        }
      ],
      'English': [
        {
          question: 'Which is the correct past tense of "go"?',
          options: ['went', 'goed', 'gone', 'going'],
          correctAnswer: 0,
          difficulty: 'easy',
          explanation: 'The past tense of "go" is "went"'
        }
      ]
    };

    const templates = questionTemplates[subject] || questionTemplates['Mathematics'];
    
    return templates.map((template, index) => ({
      id: `question-${index}`,
      chapterId: `chapter-${chapter}`,
      question: template.question,
      options: template.options,
      correctAnswer: template.correctAnswer,
      explanation: template.explanation,
      difficulty: template.difficulty,
      points: template.difficulty === 'easy' ? 10 : template.difficulty === 'medium' ? 20 : 30
    }));
  };

  const startQuiz = (quiz: QuizType) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setScore(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!activeQuiz) return;
    
    const currentQuestion = activeQuiz.questions[currentQuestionIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;

    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    if (!activeQuiz) return;

    let totalScore = 0;
    activeQuiz.questions.forEach(question => {
      const selectedAnswer = selectedAnswers[question.id];
      if (selectedAnswer === question.correctAnswer) {
        totalScore += question.points;
      }
    });

    setScore(totalScore);
    setQuizCompleted(true);

    // Update quiz as completed
    setQuizzes(prev => prev.map(q => 
      q.id === activeQuiz.id 
        ? { ...q, isCompleted: true, score: totalScore }
        : q
    ));
  };

  const resetQuiz = () => {
    setActiveQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setScore(0);
  };

  if (!currentStudent) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Loading quizzes...</p>
        </div>
      </Layout>
    );
  }

  // Quiz taking interface
  if (activeQuiz && !quizCompleted) {
    const currentQuestion = activeQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;
    const selectedAnswer = selectedAnswers[currentQuestion.id];

    return (
      <Layout>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Quiz Header */}
          <Card className="bg-gradient-primary text-white shadow-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">{activeQuiz.title}</h1>
                <Button variant="outline" onClick={resetQuiz} size="sm">
                  Exit Quiz
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</span>
                  <span>Progress: {Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Question */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{currentQuestion.difficulty}</Badge>
                <Badge variant="secondary">{currentQuestion.points} points</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className={`w-full p-4 h-auto text-left justify-start ${
                      selectedAnswer === index ? "bg-gradient-primary text-primary-foreground shadow-glow" : ""
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <span className="mr-3 text-sm font-medium">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </Button>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === undefined}
                  className="bg-gradient-primary text-primary-foreground shadow-glow"
                >
                  {currentQuestionIndex === activeQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Quiz results interface
  if (quizCompleted && activeQuiz) {
    const percentage = Math.round((score / activeQuiz.totalPoints) * 100);
    const passed = percentage >= 60;

    return (
      <Layout>
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className={`shadow-glow ${passed ? 'bg-gradient-primary text-white' : 'bg-destructive text-destructive-foreground'}`}>
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                {passed ? (
                  <Trophy className="h-16 w-16 mx-auto" />
                ) : (
                  <RotateCcw className="h-16 w-16 mx-auto" />
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {passed ? 'Congratulations!' : 'Try Again!'}
              </h1>
              <p className="text-lg mb-4">
                You scored {score} out of {activeQuiz.totalPoints} points ({percentage}%)
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={resetQuiz}
                  className={passed ? "bg-white text-primary" : ""}
                >
                  Back to Quizzes
                </Button>
                <Button 
                  onClick={() => startQuiz(activeQuiz)}
                  className={passed ? "bg-white text-primary" : ""}
                >
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Answer Review */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Answer Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeQuiz.questions.map((question, index) => {
                  const selectedAnswer = selectedAnswers[question.id];
                  const isCorrect = selectedAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">
                            {index + 1}. {question.question}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Your answer: {question.options[selectedAnswer]} 
                            {!isCorrect && (
                              <span className="ml-2">
                                (Correct: {question.options[question.correctAnswer]})
                              </span>
                            )}
                          </p>
                          {question.explanation && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Quiz selection interface
  const completedQuizzes = quizzes.filter(q => q.isCompleted);
  const availableQuizzes = quizzes.filter(q => !q.isCompleted);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Grade {currentStudent.grade} Quizzes</h1>
          <p className="text-muted-foreground">
            Test your knowledge and earn XP points
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{completedQuizzes.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{availableQuizzes.length}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {completedQuizzes.reduce((acc, q) => acc + (q.score || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </CardContent>
          </Card>
        </div>

        {/* Available Quizzes */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Available Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableQuizzes.map((quiz) => (
                <Card key={quiz.id} className="shadow-card border-border">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{quiz.title}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {quiz.timeLimit} minutes
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {quiz.totalPoints} points
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {quiz.questions.length} questions
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4 bg-gradient-primary text-primary-foreground shadow-glow"
                      onClick={() => startQuiz(quiz)}
                    >
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completed Quizzes */}
        {completedQuizzes.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Completed Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedQuizzes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">{quiz.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Score: {quiz.score}/{quiz.totalPoints} ({Math.round((quiz.score! / quiz.totalPoints) * 100)}%)
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => startQuiz(quiz)}
                    >
                      Retake
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Quiz;