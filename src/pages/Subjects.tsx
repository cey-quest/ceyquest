import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Calculator, 
  Atom, 
  Globe, 
  FileText,
  Brain,
  Heart,
  Palette,
  ChevronRight,
  PlayCircle,
  FileIcon,
  Link as LinkIcon
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Student, Subject } from '@/types';
import MathsSVG from '@/assets/maths.svg';
import ScienceSVG from '@/assets/science.svg';
import EnglishSVG from '@/assets/english.svg';
import HistorySVG from '@/assets/history.svg';
import ReligionSVG from '@/assets/reliegion.svg';
import LanguageSVG from '@/assets/Language.svg';
import ICTSVG from '@/assets/ICT.svg';
import ArabicSVG from '@/assets/Arabic.svg';
import HealthSVG from '@/assets/health&phy.edy.svg';
import ArtSVG from '@/assets/art.svg';

const Subjects = () => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const savedStudent = localStorage.getItem('ceyquest-student');
    if (savedStudent) {
      const studentData = JSON.parse(savedStudent);
      setCurrentStudent(studentData);
      generateSubjects(parseInt(studentData.grade));
    }
  }, []);

  const generateSubjects = (grade: number) => {
    const subjectIcons: { [key: string]: any } = {
      'Mathematics': Calculator,
      'Combined Mathematics': Calculator,
      'Science': Atom,
      'Physics': Atom,
      'Chemistry': Atom,
      'Biology': Heart,
      'English': FileText,
      'Sinhala': FileText,
      'History': Globe,
      'Geography': Globe,
      'Buddhism': Brain,
      'ICT': Brain,
      'Art': Palette,
      'Economics': Globe,
      'Accounting': Calculator,
      'Health & Physical Education': Heart
    };

    const getSubjectsByGrade = (grade: number): string[] => {
      if (grade >= 6 && grade <= 9) {
        return [
          'Mathematics',
          'Science',
          'English',
          'History',
          'Religion',
          'Language',
          'Civic Education',
          'Geography',
          'Second Language',
          'ICT',
          'Art',
          'Health & Physical Education',
        ];
      } else if (grade >= 10 && grade <= 11) {
        // 6 compulsory
        const compulsory = [
          'Mathematics',
          'Science',
          'English',
          'History',
          'Language',
          'Religion',
        ];
        // All basket subjects (for now, show all)
        const basket1 = ['Arabic', 'Sinhala', 'Civic Education', 'Business Studies'];
        const basket2 = ['Art', 'Tamil Literature', 'English Literature'];
        const basket3 = ['ICT', 'Agricultural', 'Health & Physical Education'];
        return [
          ...compulsory,
          ...basket1,
          ...basket2,
          ...basket3,
        ];
      }
      // fallback for other grades
      return ['Mathematics', 'Science', 'English', 'History', 'Religion', 'Language'];
    };

    const subjectNames = getSubjectsByGrade(grade);
    const generatedSubjects: Subject[] = subjectNames.map((name, index) => ({
      id: `subject-${index}`,
      name,
      grade,
      icon: subjectIcons[name] || BookOpen,
      color: `hsl(${(index * 50) % 360}, 70%, 50%)`,
      chapters: generateChapters(name),
      resources: generateResources(name)
    }));

    setSubjects(generatedSubjects);
  };

  const generateChapters = (subjectName: string) => {
    const chaptersBySubject: { [key: string]: string[] } = {
      'Mathematics': ['Numbers and Operations', 'Algebra Basics', 'Geometry', 'Measurement', 'Statistics'],
      'Combined Mathematics': ['Calculus', 'Coordinate Geometry', 'Trigonometry', 'Statistics', 'Mechanics'],
      'Science': ['Living Things', 'Matter and Energy', 'Forces and Motion', 'Earth and Universe', 'Technology'],
      'Physics': ['Mechanics', 'Heat and Thermodynamics', 'Waves and Sound', 'Electricity', 'Light and Optics'],
      'Chemistry': ['Atoms and Molecules', 'Chemical Bonding', 'Acids and Bases', 'Organic Chemistry', 'Chemical Reactions'],
      'Biology': ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Body Systems'],
      'English': ['Grammar', 'Literature', 'Creative Writing', 'Reading Comprehension', 'Speaking and Listening'],
      'Sinhala': ['Grammar', 'Literature', 'Creative Writing', 'Poetry', 'Language Skills'],
      'History': ['Ancient Sri Lanka', 'Colonial Period', 'Independence Movement', 'Modern Sri Lanka', 'World History'],
      'Geography': ['Physical Geography', 'Climate', 'Population', 'Economic Geography', 'Environmental Issues'],
      'Buddhism': ['Life of Buddha', 'Buddhist Philosophy', 'Meditation', 'Buddhist Culture', 'Modern Buddhism'],
      'ICT': ['Computer Basics', 'Programming', 'Internet Safety', 'Digital Communication', 'Database Management'],
      'Economics': ['Basic Concepts', 'Market Systems', 'National Economy', 'International Trade', 'Development Economics'],
      'Accounting': ['Basic Principles', 'Financial Statements', 'Double Entry', 'Cost Accounting', 'Management Accounting']
    };

    const chapterNames = chaptersBySubject[subjectName] || ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5'];
    
    return chapterNames.map((name, index) => ({
      id: `chapter-${index}`,
      name,
      subjectId: '',
      questions: [],
      isCompleted: Math.random() > 0.5
    }));
  };

  const generateResources = (subjectName: string) => {
    return [
      {
        id: '1',
        title: `${subjectName} Video Lessons`,
        type: 'video' as const,
        url: '#',
        description: 'Interactive video lessons covering key concepts',
        subjectId: ''
      },
      {
        id: '2',
        title: `${subjectName} Study Guide`,
        type: 'pdf' as const,
        url: '#',
        description: 'Comprehensive study materials and notes',
        subjectId: ''
      },
      {
        id: '3',
        title: `${subjectName} Practice Questions`,
        type: 'article' as const,
        url: '#',
        description: 'Additional practice questions and exercises',
        subjectId: ''
      }
    ];
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return PlayCircle;
      case 'pdf': return FileIcon;
      case 'article': return FileText;
      case 'link': return LinkIcon;
      default: return FileText;
    }
  };

  // Map subject names to their SVG images
  const subjectImages: { [key: string]: string } = {
    'Mathematics': MathsSVG,
    'Science': ScienceSVG,
    'English': EnglishSVG,
    'History': HistorySVG,
    'Religion': ReligionSVG,
    'Language': LanguageSVG,
    'ICT': ICTSVG,
    'Arabic': ArabicSVG,
    'Health & Physical Education': HealthSVG,
    'Art': ArtSVG,
  };

  if (!currentStudent) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Loading your subjects...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 px-[30px]">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="block w-8 h-1 bg-white mr-4 rounded" />
            <h1 className="font-bold text-white" style={{ fontSize: '18px', fontFamily: 'Inter, sans-serif' }}>Subjects</h1>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Grade {currentStudent.grade} Subjects</h2>
            <p className="text-muted-foreground">
              Explore your curriculum and master each subject
            </p>
          </div>
        </div>

        {/* Subjects Section */}
        {currentStudent.grade >= 10 && currentStudent.grade <= 11 ? (
          <>
            {/* Compulsory Subjects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.filter(s => [
                'Mathematics', 'Science', 'English', 'History', 'Language', 'Religion'
              ].includes(s.name)).map(subject => (
                <Card key={subject.id} className="shadow-card transition-all duration-300 group w-[85%] aspect-[4/3] mx-auto flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    {subjectImages[subject.name] && (
                      <div className="flex justify-center items-center w-full h-full">
                        <img src={subjectImages[subject.name]} alt={subject.name} className="w-full h-full object-contain" />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-end">
                    <div className="flex-1" />
                    <Link to={`/subject/${subject.id}`} className="w-1/2 mt-auto mx-auto">
                      <Button className="w-full" variant="outline">
                        View Subject
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Basket Subjects */}
            <div className="mt-8">
              <div className="flex items-center mb-4">
                <span className="block w-8 h-1 bg-white mr-4 rounded" />
                <h2 className="font-bold text-white" style={{ fontSize: '18px', fontFamily: 'Inter, sans-serif' }}>Basket Subjects</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Basket 1 */}
                <div>
                  <h3 className="font-semibold mb-2">Basket 1</h3>
                  <div className="space-y-3">
                    {subjects.filter(s => ['Arabic', 'Sinhala', 'Civic Education', 'Business Studies'].includes(s.name)).map(subject => (
                      <Card key={subject.id} className="shadow-card transition-all duration-300 group w-[85%] aspect-[4/3] mx-auto flex flex-col justify-between">
                        <CardHeader>
                          <CardTitle className="text-base">{subject.name}</CardTitle>
                          {subjectImages[subject.name] && (
                            <div className="flex justify-center items-center w-full h-full">
                              <img src={subjectImages[subject.name]} alt={subject.name} className="w-full h-full object-contain" />
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col justify-end">
                          <div className="flex-1" />
                          <Link to={`/subject/${subject.id}`} className="w-full mt-auto">
                            <Button className="w-full" variant="outline">
                              View Subject
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                {/* Basket 2 */}
                <div>
                  <h3 className="font-semibold mb-2">Basket 2</h3>
                  <div className="space-y-3">
                    {subjects.filter(s => ['Art', 'Tamil Literature', 'English Literature'].includes(s.name)).map(subject => (
                      <Card key={subject.id} className="shadow-card transition-all duration-300 group w-[85%] aspect-[4/3] mx-auto flex flex-col justify-between">
                        <CardHeader>
                          <CardTitle className="text-base">{subject.name}</CardTitle>
                          {subjectImages[subject.name] && (
                            <div className="flex justify-center items-center w-full h-full">
                              <img src={subjectImages[subject.name]} alt={subject.name} className="w-full h-full object-contain" />
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col justify-end">
                          <div className="flex-1" />
                          <Link to={`/subject/${subject.id}`} className="w-full mt-auto">
                            <Button className="w-full" variant="outline">
                              View Subject
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                {/* Basket 3 */}
                <div>
                  <h3 className="font-semibold mb-2">Basket 3</h3>
                  <div className="space-y-3">
                    {subjects.filter(s => ['ICT', 'Agricultural', 'Health & Physical Education'].includes(s.name)).map(subject => (
                      <Card key={subject.id} className="shadow-card transition-all duration-300 group w-[85%] aspect-[4/3] mx-auto flex flex-col justify-between">
                        <CardHeader>
                          <CardTitle className="text-base">{subject.name}</CardTitle>
                          {subjectImages[subject.name] && (
                            <div className="flex justify-center items-center w-full h-full">
                              <img src={subjectImages[subject.name]} alt={subject.name} className="w-full h-full object-contain" />
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col justify-end">
                          <div className="flex-1" />
                          <Link to={`/subject/${subject.id}`} className="w-full mt-auto">
                            <Button className="w-full" variant="outline">
                              View Subject
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(subject => (
              <Card key={subject.id} className="shadow-card transition-all duration-300 group w-[85%] aspect-[4/3] mx-auto flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                  {subjectImages[subject.name] && (
                    <div className="flex justify-center items-center w-full h-full">
                      <img src={subjectImages[subject.name]} alt={subject.name} className="w-full h-full object-contain" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-end">
                  <div className="flex-1" />
                  <Button className="w-full mt-auto" variant="outline">
                    View Subject
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Your Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{subjects.length}</div>
                <div className="text-sm text-muted-foreground">Total Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {subjects.reduce((acc, s) => acc + s.chapters.filter(c => c.isCompleted).length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Chapters Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {subjects.reduce((acc, s) => acc + s.resources.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Resources Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Subjects;