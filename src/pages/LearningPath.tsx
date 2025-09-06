import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, PlayCircle, CheckCircle, Plus, Brain } from "lucide-react";
import { toast } from "sonner";
import LessonChatbot from "@/components/LessonChatbot";
import PathDiscoveryModal from "@/components/PathDiscoveryModal";

export default function LearningPath() {
  const [searchParams] = useSearchParams();
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [userLevel, setUserLevel] = useState("");
  const [showLesson, setShowLesson] = useState(false);
  const [showPathDiscovery, setShowPathDiscovery] = useState(false);
  const [addedPaths, setAddedPaths] = useState<string[]>([]);
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
    if (searchParams.get("quiz") === "true") {
      setShowQuiz(true);
    }
    
    const savedLevel = localStorage.getItem("user_level") || "Beginner";
    setUserLevel(savedLevel);
  }, [searchParams]);

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
      
      let level = "Beginner";
      if (avgScore >= 2.5) level = "Advanced";
      else if (avgScore >= 1) level = "Intermediate";
      
      setUserLevel(level);
      localStorage.setItem("user_level", level);
      setShowQuiz(false);
      setQuizStep(0);
      setQuizAnswers([]);
      toast.success("Your personalized learning path is ready!");
    }
  };

  const handleAddPath = (pathId: string) => {
    setAddedPaths(prev => [...prev, pathId]);
    // Here you would typically add the path to the user's learning paths
    // For now, we'll just show success feedback
  };

  const learningPaths = [
    {
      id: "embedded-basics",
      title: "Embedded Systems Fundamentals",
      description: "Master the core concepts of embedded programming",
      active: true,
      lessons: [
        { title: "Microcontroller Basics", completed: true, current: false },
        { title: "GPIO Programming", completed: true, current: false },
        { title: "Timer & PWM Control", completed: false, current: true },
        { title: "Interrupt Handling", completed: false, current: false },
        { title: "UART Communication", completed: false, current: false },
        { title: "I2C & SPI Protocols", completed: false, current: false },
      ]
    },
    {
      id: "rtos-advanced",
      title: "Real-Time Operating Systems",
      description: "Deep dive into RTOS concepts and implementation",
      active: false,
      lessons: [
        { title: "RTOS Introduction", completed: false, current: false },
        { title: "Task Management", completed: false, current: false },
        { title: "Synchronization", completed: false, current: false },
        { title: "Memory Management", completed: false, current: false },
      ]
    },
    {
      id: "iot-connectivity",
      title: "IoT Connectivity & Protocols", 
      description: "Learn modern IoT protocols and wireless communication",
      active: false,
      lessons: [
        { title: "WiFi Integration", completed: false, current: false },
        { title: "Bluetooth Low Energy", completed: false, current: false },
        { title: "MQTT Protocol", completed: false, current: false },
        { title: "Cloud Integration", completed: false, current: false },
      ]
    }
  ];

  if (showQuiz) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="shadow-lg">
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
                  className="text-left justify-start p-4 h-auto hover:bg-primary/10"
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

  if (showLesson) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Button variant="outline" onClick={() => setShowLesson(false)}>
            ← Back to Learning Path
          </Button>
        </div>
        <LessonChatbot />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Learning Path</h1>
          <p className="text-muted-foreground mt-1">
            Your skill level: <Badge variant="secondary">{userLevel}</Badge>
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowQuiz(true)} className="gap-2">
            <Brain className="w-4 h-4" />
            Retake Assessment
          </Button>
          <Button onClick={() => navigate('/dashboard/lessons')} className="gap-2">
            <PlayCircle className="w-4 h-4" />
            Continue Learning
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {learningPaths.map((path) => (
          <Card key={path.id} className={path.active ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {path.title}
                    {path.active && <Badge>Active</Badge>}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">{path.description}</p>
                </div>
                {!path.active && (
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Path
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {path.lessons.map((lesson, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                    lesson.current ? 'bg-primary/10 border border-primary/20' : 
                    lesson.completed ? 'bg-green-50 dark:bg-green-950' : 'bg-muted'
                  }`}>
                    {lesson.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : lesson.current ? (
                      <PlayCircle className="w-5 h-5 text-primary" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                    )}
                    <span className={`font-medium ${
                      lesson.current ? 'text-primary' : 
                      lesson.completed ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'
                    }`}>
                      {lesson.title}
                    </span>
                    {lesson.current && <Badge>Current</Badge>}
                  </div>
                ))}
              </div>
              {path.active && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>33%</span>
                  </div>
                  <Progress value={33} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed hover:border-primary/50 transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Plus className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Discover New Learning Paths</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-md">
            Explore curated learning paths created by experts and the community. Find specialized tracks in DevOps, AI/ML, Web Development, and more.
          </p>
          <Button 
            className="gap-2"
            onClick={() => setShowPathDiscovery(true)}
          >
            <Plus className="w-4 h-4" />
            Browse Available Paths
          </Button>
        </CardContent>
      </Card>

      <PathDiscoveryModal
        open={showPathDiscovery}
        onOpenChange={setShowPathDiscovery}
        onAddPath={handleAddPath}
      />
    </div>
  );
}