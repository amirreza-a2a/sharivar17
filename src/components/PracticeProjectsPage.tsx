import React, { useState } from 'react';
import { ArrowLeft, Trophy, Target, Brain, Globe, Users, Zap, BookOpen, Code, Lightbulb, Star, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PracticeProjectsPageProps {
  onBack: () => void;
}

const PracticeProjectsPage: React.FC<PracticeProjectsPageProps> = ({ onBack }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');

  const challenges = [
    {
      id: 1,
      title: "LED Blink with Timer Interrupt",
      description: "Write embedded C code to blink an LED using timer interrupts instead of delays",
      difficulty: "Beginner",
      field: "Embedded Systems",
      estimatedTime: "30 min",
      points: 100,
      tags: ["C", "Timers", "GPIO"],
      completed: true
    },
    {
      id: 2,
      title: "Power Optimization in IoT Device",
      description: "Optimize power consumption in an ESP32-based sensor node for battery operation",
      difficulty: "Intermediate",
      field: "Embedded Systems",
      estimatedTime: "2 hours",
      points: 250,
      tags: ["ESP32", "Power Management", "IoT"],
      completed: false
    },
    {
      id: 3,
      title: "Neural Network Quantization",
      description: "Implement 8-bit quantization for a pre-trained CNN model to reduce inference time",
      difficulty: "Advanced",
      field: "AI/ML",
      estimatedTime: "4 hours",
      points: 500,
      tags: ["PyTorch", "Quantization", "Optimization"],
      completed: false
    }
  ];

  const projects = [
    {
      id: 1,
      title: "RFID Attendance System",
      description: "Build a complete attendance tracking system using RFID cards and microcontroller",
      difficulty: "Beginner",
      field: "Embedded Systems",
      estimatedTime: "1 week",
      learningOutcomes: ["RFID communication", "Database integration", "Real-time systems"],
      tools: ["Arduino", "RFID Module", "LCD Display"],
      completed: false
    },
    {
      id: 2,
      title: "Smart Sensor Node with MQTT",
      description: "Design a wireless sensor network node with environmental monitoring",
      difficulty: "Intermediate",
      field: "IoT",
      estimatedTime: "2 weeks",
      learningOutcomes: ["Wireless protocols", "Data acquisition", "Cloud integration"],
      tools: ["ESP32", "Sensors", "MQTT Broker"],
      completed: false
    },
    {
      id: 3,
      title: "Quantum Key Distribution Simulator",
      description: "Implement BB84 protocol simulation for quantum cryptography",
      difficulty: "Advanced",
      field: "Quantum Computing",
      estimatedTime: "3 weeks",
      learningOutcomes: ["Quantum protocols", "Cryptography", "Simulation"],
      tools: ["Python", "Qiskit", "NumPy"],
      completed: false
    }
  ];

  const researchProblems = [
    {
      id: 1,
      title: "Low-Power Neuromorphic Chip Design",
      description: "Investigating energy-efficient architectures for brain-inspired computing",
      field: "Embedded Systems",
      difficulty: "Advanced",
      paperCount: 127,
      lastUpdated: "2024-01-15",
      tags: ["Neuromorphic", "ASIC", "Machine Learning"]
    },
    {
      id: 2,
      title: "Quantum Error Correction in NISQ Devices",
      description: "Developing error mitigation strategies for noisy intermediate-scale quantum computers",
      field: "Quantum Computing",
      difficulty: "Expert",
      paperCount: 89,
      lastUpdated: "2024-01-12",
      tags: ["Error Correction", "NISQ", "Quantum Algorithms"]
    },
    {
      id: 3,
      title: "5G mmWave Beamforming Optimization",
      description: "ML-based beamforming techniques for enhanced coverage in urban environments",
      field: "Telecommunication",
      difficulty: "Advanced",
      paperCount: 156,
      lastUpdated: "2024-01-18",
      tags: ["5G", "Beamforming", "Machine Learning"]
    }
  ];

  const realWorldProblems = [
    {
      id: 1,
      title: "Smart Agriculture Water Management",
      description: "Design an IoT system to optimize water usage in farming (UN SDG 6: Clean Water)",
      impact: "Environmental",
      difficulty: "Intermediate",
      estimatedTime: "2-3 weeks",
      sdg: "SDG 6",
      technologies: ["IoT Sensors", "Machine Learning", "Cloud Computing"],
      collaboration: "Open for teams"
    },
    {
      id: 2,
      title: "Drone Anti-Jamming Communication",
      description: "Develop resilient communication protocols for drone swarms in contested environments",
      impact: "Security",
      difficulty: "Advanced",
      estimatedTime: "4-6 weeks",
      sdg: "SDG 16",
      technologies: ["RF Engineering", "Signal Processing", "Cybersecurity"],
      collaboration: "Industry partnership available"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'expert': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Practice & Projects
                </h1>
                <p className="text-muted-foreground">Bridge theory with real-world application</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold">1,250 XP</span>
              </div>
              <Button className="bg-gradient-to-r from-primary to-primary/80">
                <Zap className="h-4 w-4 mr-2" />
                AI Mentor
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Practice
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="research" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Research
            </TabsTrigger>
            <TabsTrigger value="realworld" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Real-World
            </TabsTrigger>
          </TabsList>

          {/* Practice Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Practice Challenges</h2>
                <p className="text-muted-foreground">Short exercises to sharpen your skills</p>
              </div>
              <Button variant="outline">
                <Lightbulb className="h-4 w-4 mr-2" />
                Get AI Challenge
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      {challenge.completed && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Trophy className="h-4 w-4" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {challenge.estimatedTime}
                      </div>
                      <div className="flex items-center gap-1 text-primary font-medium">
                        <Star className="h-4 w-4" />
                        {challenge.points} XP
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {challenge.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      className="w-full" 
                      variant={challenge.completed ? "outline" : "default"}
                    >
                      {challenge.completed ? "Review Solution" : "Start Challenge"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI-Generated Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">AI-Generated Projects</h2>
                <p className="text-muted-foreground">Comprehensive projects tailored to your level</p>
              </div>
              <Button variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Generate New Project
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge className={getDifficultyColor(project.difficulty)}>
                        {project.difficulty}
                      </Badge>
                      <Badge variant="secondary">{project.field}</Badge>
                    </div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {project.estimatedTime}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Learning Outcomes:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {project.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Tools & Technologies:</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.tools.map((tool) => (
                          <Badge key={tool} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Start Project
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Research Problems Tab */}
          <TabsContent value="research" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Research Problem Explorer</h2>
                <p className="text-muted-foreground">Dive into cutting-edge research challenges</p>
              </div>
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Explore More Problems
              </Button>
            </div>

            <div className="space-y-4">
              {researchProblems.map((problem) => (
                <Card key={problem.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                        <Badge variant="secondary">{problem.field}</Badge>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>{problem.paperCount} papers</div>
                        <div>Updated {problem.lastUpdated}</div>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{problem.title}</CardTitle>
                    <CardDescription className="text-base">{problem.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Brain className="h-4 w-4 mr-2" />
                        Explore Problem
                      </Button>
                      <Button variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Recent Papers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Real-World Problems Tab */}
          <TabsContent value="realworld" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Real-World Impact Projects</h2>
                <p className="text-muted-foreground">Solve problems that matter to society and industry</p>
              </div>
              <Button variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Find More Challenges
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {realWorldProblems.map((problem) => (
                <Card key={problem.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                        <Badge variant="secondary">{problem.sdg}</Badge>
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-700 border-blue-200">
                        {problem.impact}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{problem.title}</CardTitle>
                    <CardDescription className="text-base">{problem.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {problem.estimatedTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {problem.collaboration}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-1">
                        {problem.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Globe className="h-4 w-4 mr-2" />
                        Take on Challenge
                      </Button>
                      <Button variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Find Team
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PracticeProjectsPage;