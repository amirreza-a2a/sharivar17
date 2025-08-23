
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Code, Cpu, Zap, CheckCircle, PlayCircle, BookOpen, Target, LogIn, Settings, FileText, Wrench, Microchip } from "lucide-react";
import { toast } from "sonner";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { User, Session } from "@supabase/supabase-js";
import LessonChatbot from "@/components/LessonChatbot";
import { PDFAnalysisPage } from "@/components/PDFAnalysisPage";
import { RDToolsPage } from "@/components/RDToolsPage";
import PracticeProjectsPage from "@/components/PracticeProjectsPage";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'dashboard' | 'lesson' | 'pdf' | 'rdtools' | 'practice' | 'settings'>('home');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [quizStep, setQuizStep] = useState(0);
  const [userLevel, setUserLevel] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  const quizQuestions = [
    {
      question: "How familiar are you with microcontrollers?",
      options: [
        "Never used one",
        "Basic Arduino projects",
        "Professional STM32/PIC experience", 
        "Expert in multiple architectures"
      ]
    },
    {
      question: "What's your experience with real-time operating systems?",
      options: [
        "What's an RTOS?",
        "Heard of FreeRTOS",
        "Used FreeRTOS in projects",
        "Expert in multiple RTOS platforms"
      ]
    },
    {
      question: "How comfortable are you with C programming?",
      options: [
        "Beginner",
        "Can write basic programs", 
        "Intermediate - pointers, structs",
        "Advanced - embedded optimization"
      ]
    }
  ];

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    try {
      const flag = localStorage.getItem('start_quiz_after_auth');
      if (flag === '1') {
        localStorage.removeItem('start_quiz_after_auth');
        setCurrentView('quiz');
        setQuizStep(0);
        setQuizAnswers([]);
        toast.success("Welcome! Let's set up your learning path.");
      }
    } catch {}
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers, quizQuestions[quizStep].options[answerIndex]];
    setQuizAnswers(newAnswers);
    
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Determine user level based on answers
      const avgScore = newAnswers.reduce((acc, answer, index) => {
        const score = quizQuestions[index].options.indexOf(answer);
        return acc + score;
      }, 0) / quizQuestions.length;
      
      if (avgScore < 1) setUserLevel("Beginner");
      else if (avgScore < 2.5) setUserLevel("Intermediate");
      else setUserLevel("Advanced");
      
      setCurrentView("dashboard");
      toast.success("Your personalized learning path is ready!");
    }
  };

  const startQuiz = () => {
    setCurrentView("quiz");
    setQuizStep(0);
    setQuizAnswers([]);
  };

  const learningPath = [
    { title: "Microcontroller Basics", completed: true, current: false },
    { title: "GPIO Programming", completed: true, current: false },
    { title: "Timer & PWM Control", completed: false, current: true },
    { title: "Interrupt Handling", completed: false, current: false },
    { title: "UART Communication", completed: false, current: false },
    { title: "I2C & SPI Protocols", completed: false, current: false },
  ];

  const todayTasks = [
    "Complete Timer Configuration lesson",
    "Practice PWM duty cycle control",
    "Review interrupt priority concepts"
  ];

  const resources = [
    {
      title: "STM32 Timer Deep Dive",
      type: "Video",
      duration: "12 min",
      verified: true
    },
    {
      title: "PWM Control Examples",
      type: "GitHub",
      duration: "Code samples",
      verified: true
    },
    {
      title: "Real-time Systems Theory",
      type: "Article", 
      duration: "8 min read",
      verified: false
    }
  ];

  if (currentView === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("settings")}>
            <Settings className="w-4 h-4" />
          </Button>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 p-4 rounded-2xl">
                <Cpu className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Learn Embedded Systems,{" "}
              <span className="text-blue-600">Smarter</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI-powered personalized learning paths that adapt to your skill level. 
              Master microcontrollers, RTOS, and embedded programming step by step.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={startQuiz}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                <Brain className="w-5 h-5 mr-2" />
                Get Your Learning Path
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setCurrentView("pdf")}
                className="text-lg px-8 py-3"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Analyze PDFs
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Personalized Paths</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">AI analyzes your skill level and creates a custom roadmap just for you</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Code className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Hands-on Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Real code examples and projects for STM32, Arduino, and more platforms</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Smart Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Curated videos, articles, and documentation tailored to your current lesson</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "settings") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <Button variant="outline" onClick={() => setCurrentView("home")}>
              Back to Home
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Theme</h3>
                  <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                </div>
                <DarkModeToggle />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Get notified about your learning progress</p>
                </div>
                <Button
                  variant={notificationsEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                >
                  {notificationsEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === "quiz") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">Let's Assess Your Level</CardTitle>
            <Progress value={(quizStep / quizQuestions.length) * 100} className="mt-4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-xl font-semibold">{quizQuestions[quizStep].question}</h3>
            <div className="grid gap-3">
              {quizQuestions[quizStep].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleQuizAnswer(index)}
                  className="text-left justify-start p-4 h-auto hover:bg-blue-50"
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === "dashboard") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
              <p className="text-gray-600">Your skill level: <Badge variant="secondary">{userLevel}</Badge></p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView("settings")}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={() => setCurrentView("pdf")} className="gap-2">
                <FileText className="w-4 h-4" />
                Analyze PDF
              </Button>
              <Button variant="outline" onClick={() => setCurrentView("rdtools")} className="gap-2">
                <Wrench className="w-4 h-4" />
                R&D Tools
              </Button>
              <Button variant="outline" onClick={() => setCurrentView("practice")} className="gap-2">
                <Target className="w-4 h-4" />
                Practice & Projects
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/electronics-hub"} className="gap-2">
                <Microchip className="w-4 h-4" />
                Electronics Hub
              </Button>
              <Button onClick={() => setCurrentView("lesson")} className="bg-blue-600">
                <PlayCircle className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Learning Path */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Your Learning Path
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningPath.map((item, index) => (
                      <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                        item.current ? 'bg-blue-50 border border-blue-200' : 
                        item.completed ? 'bg-green-50' : 'bg-gray-50'
                      }`}>
                        {item.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : item.current ? (
                          <PlayCircle className="w-6 h-6 text-blue-600" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                        )}
                        <span className={`font-medium ${
                          item.current ? 'text-blue-900' : 
                          item.completed ? 'text-green-900' : 'text-gray-600'
                        }`}>
                          {item.title}
                        </span>
                        {item.current && <Badge>Current</Badge>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Today's Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todayTasks.map((task, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded border-2 border-gray-300 mt-1" />
                        <span className="text-sm text-gray-700">{task}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>33%</span>
                      </div>
                      <Progress value={33} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Current Module</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended for You</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {resources.map((resource, index) => (
                      <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{resource.title}</span>
                          {resource.verified && (
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          )}
                        </div>
                        <div className="flex gap-2 text-xs text-gray-600">
                          <span>{resource.type}</span>
                          <span>•</span>
                          <span>{resource.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* PDF Analysis Tool */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    PDF Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload PDF documents for AI-powered analysis and explanations
                  </p>
                  <Button 
                    onClick={() => setCurrentView("pdf")} 
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <FileText className="w-4 h-4" />
                    Analyze PDF
                  </Button>
                </CardContent>
              </Card>

              {/* R&D Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    R&D Tools Hub
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Discover latest tools, frameworks, and methodologies for innovation
                  </p>
                  <Button 
                    onClick={() => setCurrentView("rdtools")} 
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <Wrench className="w-4 h-4" />
                    Explore Tools
                  </Button>
                </CardContent>
              </Card>

              {/* Practice & Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Practice & Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Hands-on challenges, AI-generated projects, and real-world problems
                  </p>
                  <Button 
                    onClick={() => setCurrentView("practice")} 
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <Target className="w-4 h-4" />
                    Start Practicing
                  </Button>
                </CardContent>
              </Card>

              {/* Electronics Hub */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Microchip className="w-5 h-5" />
                    Electronics Hub
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Professional electronics design toolkit with parts database and design sharing
                  </p>
                  <Button 
                    onClick={() => window.location.href = "/electronics-hub"} 
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <Microchip className="w-4 h-4" />
                    Explore Hub
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "lesson") {
    return (
      <div className="min-h-screen bg-white">
        {/* Lesson Header */}
        <div className="border-b bg-white sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Timer & PWM Control</h1>
                <p className="text-gray-600">Module 3 of 6 • Intermediate Level</p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" onClick={() => setCurrentView("settings")}>
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => setCurrentView("dashboard")}>
                  Back to Dashboard
                </Button>
                <Button className="bg-blue-600">
                  Mark Complete
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2>Understanding STM32 Timers</h2>
            <p className="text-gray-700 leading-relaxed">
              STM32 microcontrollers feature powerful timer peripherals that can generate precise timing signals, 
              count external events, and create PWM (Pulse Width Modulation) outputs for motor control and LED dimming.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-6">
              <h3 className="text-lg font-semibold text-blue-900 mt-0">Learning Objectives</h3>
              <ul className="text-blue-800 mb-0">
                <li>Configure timer clock sources and prescalers</li>
                <li>Generate PWM signals with variable duty cycles</li>
                <li>Handle timer overflow interrupts</li>
                <li>Control servo motors using timer PWM</li>
              </ul>
            </div>

            <h3>Timer Configuration Code</h3>
            <div className="bg-gray-900 text-white p-6 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`// Configure TIM3 for PWM output on Channel 1
void configure_pwm_timer(void) {
    // Enable TIM3 clock
    RCC->APB1ENR |= RCC_APB1ENR_TIM3EN;
    
    // Configure prescaler (72MHz -> 1MHz)
    TIM3->PSC = 71;
    
    // Set auto-reload value for 1kHz PWM
    TIM3->ARR = 999;
    
    // Configure Channel 1 for PWM mode 1
    TIM3->CCMR1 |= TIM_CCMR1_OC1M_2 | TIM_CCMR1_OC1M_1;
    TIM3->CCMR1 |= TIM_CCMR1_OC1PE;
    
    // Enable output on Channel 1
    TIM3->CCER |= TIM_CCER_CC1E;
    
    // Set initial duty cycle (50%)
    TIM3->CCR1 = 500;
    
    // Enable timer
    TIM3->CR1 |= TIM_CR1_CEN;
}`}</pre>
            </div>

            <p className="text-gray-700">
              This code configures Timer 3 to generate a 1kHz PWM signal with 50% duty cycle. 
              The prescaler divides the 72MHz system clock down to 1MHz, and the auto-reload 
              register creates the 1kHz output frequency.
            </p>

            <h3>Next Steps</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Practice Exercise</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Modify the duty cycle dynamically using a potentiometer input
                  </p>
                  <Button size="sm" variant="outline">
                    Start Exercise
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Next Lesson</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Interrupt Handling and Timer Events
                  </p>
                  <Button size="sm" className="bg-blue-600">
                    Continue
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          <LessonChatbot lessonTitle="Timer & PWM Control" />
        </div>
      </div>
    );
  }

  if (currentView === "pdf") {
    return <PDFAnalysisPage onBack={() => setCurrentView("home")} />;
  }

  if (currentView === "rdtools") {
    return <RDToolsPage />;
  }

  if (currentView === "practice") {
    return <PracticeProjectsPage onBack={() => setCurrentView("dashboard")} />;
  }

  return null;
};

export default Index;
