import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, Bot, User, BookOpen, Lightbulb, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Student } from '@/types';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  subject?: string;
}

const CeynovX = () => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedStudent = localStorage.getItem('ceyquest-student');
    if (savedStudent) {
      setCurrentStudent(JSON.parse(savedStudent));
    }

    // Load initial welcome message
    setMessages([{
      id: '1',
      type: 'ai',
      content: `Hello! I'm CeynovX, your AI learning companion. I'm here to help you with your Grade ${JSON.parse(savedStudent || '{}').grade || '6'} Sri Lankan curriculum questions. Ask me anything about your subjects!`,
      timestamp: new Date(),
    }]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response (in a real app, this would call an AI API)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue, currentStudent?.grade || 6),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (question: string, grade: number): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('math') || lowerQuestion.includes('calculate') || lowerQuestion.includes('equation')) {
      return `Great math question! For Grade ${grade}, let me help you understand this step by step. Mathematics in the Sri Lankan curriculum focuses on building strong foundational concepts. Would you like me to break down a specific problem or concept?`;
    }

    if (lowerQuestion.includes('science') || lowerQuestion.includes('physics') || lowerQuestion.includes('chemistry') || lowerQuestion.includes('biology')) {
      return `Excellent science inquiry! The Grade ${grade} Sri Lankan science curriculum covers fascinating topics. I can help explain concepts with real-world examples from Sri Lanka. What specific area would you like to explore?`;
    }

    if (lowerQuestion.includes('english') || lowerQuestion.includes('essay') || lowerQuestion.includes('grammar')) {
      return `Perfect! English language skills are crucial for your academic success. The Sri Lankan curriculum emphasizes both language proficiency and literature appreciation. I can help with grammar, essay writing, or literature analysis. What would you like to work on?`;
    }

    if (lowerQuestion.includes('sinhala') || lowerQuestion.includes('buddhism') || lowerQuestion.includes('history')) {
      return `Wonderful question about our cultural subjects! These subjects help you understand Sri Lankan heritage and values. I can explain concepts in both Sinhala and English to help you better understand. What specific topic interests you?`;
    }

    return `That's an interesting question! As your AI tutor for Grade ${grade}, I'm here to help you understand any concept from your Sri Lankan curriculum. Could you tell me which subject this relates to? I can provide detailed explanations, examples, and practice questions tailored to your grade level.`;
  };

  const quickQuestions = [
    "Explain photosynthesis in simple terms",
    "Help me solve algebra equations",
    "What are the parts of speech in English?",
    "Teach me about Sri Lankan history",
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-primary text-white shadow-glow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Brain className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">CeynovX AI Tutor</h1>
                <p className="text-white/90">
                  Your intelligent learning companion for Grade {currentStudent?.grade || '6'} curriculum
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Quick Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left h-auto p-3 justify-start"
                  onClick={() => setInputValue(question)}
                >
                  <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{question}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Chat with CeynovX
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    {message.type === 'ai' ? (
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-secondary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={`flex-1 max-w-xs sm:max-w-md p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-12'
                        : 'bg-muted mr-12'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
                      <Clock className="h-3 w-3" />
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg mr-12">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about your studies..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-primary text-primary-foreground shadow-glow"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Curriculum Aligned</h3>
              <p className="text-sm text-muted-foreground">
                Answers based on Sri Lankan curriculum
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Smart Explanations</h3>
              <p className="text-sm text-muted-foreground">
                Clear, step-by-step explanations
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Lightbulb className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">24/7 Available</h3>
              <p className="text-sm text-muted-foreground">
                Get help anytime you need it
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CeynovX;