import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target, PlayCircle, CheckCircle, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Dashboard() {
  const [userLevel, setUserLevel] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed quiz or set default level
    const savedLevel = localStorage.getItem("user_level") || "Beginner";
    setUserLevel(savedLevel);
  }, []);

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

  const startQuiz = () => {
    navigate("/dashboard/learning-path?quiz=true");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">
            Your skill level: <Badge variant="secondary">{userLevel}</Badge>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={startQuiz} variant="outline" className="gap-2">
            <Brain className="w-4 h-4" />
            Retake Assessment
          </Button>
          <Button onClick={() => navigate("/dashboard/learning-path")} className="gap-2">
            <PlayCircle className="w-4 h-4" />
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
                    item.current ? 'bg-primary/10 border border-primary/20' : 
                    item.completed ? 'bg-green-50 dark:bg-green-950' : 'bg-muted'
                  }`}>
                    {item.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : item.current ? (
                      <PlayCircle className="w-6 h-6 text-primary" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
                    )}
                    <span className={`font-medium ${
                      item.current ? 'text-primary' : 
                      item.completed ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'
                    }`}>
                      {item.title}
                    </span>
                    {item.current && <Badge>Current</Badge>}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button 
                  onClick={() => navigate("/dashboard/learning-path")}
                  className="w-full"
                >
                  Expand Learning Path
                </Button>
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
                    <div className="w-4 h-4 rounded border-2 border-muted-foreground mt-1" />
                    <span className="text-sm">{task}</span>
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
                  <div key={index} className="flex items-start gap-3 p-2 rounded border">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{resource.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {resource.duration}
                        </span>
                        {resource.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}