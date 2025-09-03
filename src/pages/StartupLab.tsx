import { useState, useEffect, useRef } from "react";
import { Plus, Lightbulb, Target, Users, TrendingUp, Sparkles, Briefcase, GraduationCap, BookmarkPlus, MessageCircle, User, Calendar, ArrowRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { startupStorage } from "@/utils/startupStorage";
import type { StartupIdea } from "@/types/startup";
import { toast } from "sonner";

const stageColors = {
  idea: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  validation: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", 
  prototype: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  launched: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
};

const mockChallenges = [
  {
    id: "1",
    title: "Low-Power 5G Modem Design",
    description: "We are seeking breakthrough innovations in power efficiency for mobile 5G modems. Current solutions consume 40% more power than 4G counterparts, significantly impacting battery life. The ideal solution should reduce power consumption by at least 30% while maintaining performance standards.",
    tags: ["5G", "Power", "RF"],
    type: "challenge" as const,
    stakeholder: "TechCorp Industries",
    impact: "Could extend smartphone battery life by 6-8 hours and enable new IoT applications",
    requirements: "PhD in Electrical Engineering, 3+ years RF experience, access to lab facilities",
    posted: "2 days ago"
  },
  {
    id: "2", 
    title: "Neuromorphic Computing Chips",
    description: "Brain-inspired computing architecture that mimics neural networks in hardware, achieving 1000x lower power consumption than traditional processors for AI workloads. Our research has demonstrated successful pattern recognition with 99.2% accuracy using only 2mW of power.",
    tags: ["AI", "Neuromorphic", "Low-Power"],
    type: "research" as const,
    stakeholder: "Dr. Sarah Chen, MIT",
    impact: "Revolutionary AI processing for edge devices, smartphones, and IoT sensors",
    requirements: "Industry partner for manufacturing, $2M funding, regulatory approval",
  posted: "1 week ago"
  }
];

const mockRoadmapData = [
  {
    id: "q1-2024",
    title: "Q1 2024 - Foundation",
    tasks: [
      { id: "1", title: "Market Research", status: "completed", priority: "high" },
      { id: "2", title: "MVP Design", status: "completed", priority: "high" },
      { id: "3", title: "Team Building", status: "in-progress", priority: "medium" }
    ]
  },
  {
    id: "q2-2024", 
    title: "Q2 2024 - Development",
    tasks: [
      { id: "4", title: "Backend Development", status: "in-progress", priority: "high" },
      { id: "5", title: "Frontend Implementation", status: "pending", priority: "high" },
      { id: "6", title: "Beta Testing Setup", status: "pending", priority: "medium" }
    ]
  },
  {
    id: "q3-2024",
    title: "Q3 2024 - Launch Prep", 
    tasks: [
      { id: "7", title: "Marketing Campaign", status: "pending", priority: "high" },
      { id: "8", title: "Legal Documentation", status: "pending", priority: "medium" },
      { id: "9", title: "Partnership Outreach", status: "pending", priority: "low" }
    ]
  }
];

function RoadmapZoomControls({ 
  zoom, 
  onZoomIn, 
  onZoomOut, 
  onReset 
}: { 
  zoom: number; 
  onZoomIn: () => void; 
  onZoomOut: () => void; 
  onReset: () => void; 
}) {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    setShowIndicator(true);
    const timer = setTimeout(() => setShowIndicator(false), 1000);
    return () => clearTimeout(timer);
  }, [zoom]);

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 bg-background/80 backdrop-blur-sm border rounded-lg p-2 shadow-lg z-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={onZoomIn}
              disabled={zoom >= 2.5}
              className="h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Zoom In (+)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={onReset}
              className="h-8 w-8"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Reset Zoom (0)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={onZoomOut}
              disabled={zoom <= 0.5}
              className="h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Zoom Out (-)</TooltipContent>
        </Tooltip>

        {showIndicator && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs animate-fade-in">
            {Math.round(zoom * 100)}%
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

function StartupRoadmap() {
  const [zoom, setZoom] = useState(1);
  const roadmapRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => setZoom(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '+':
          case '=':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
          case '0':
            e.preventDefault();
            handleReset();
            break;
        }
      } else {
        switch (e.key) {
          case '+':
            handleZoomIn();
            break;
          case '-':
            handleZoomOut();
            break;
          case '0':
            handleReset();
            break;
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    roadmapRef.current?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      roadmapRef.current?.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className="mt-12">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-2xl font-bold">Startup Roadmap</h2>
        <p className="text-muted-foreground">
          Track your startup journey with interactive milestones and tasks
        </p>
      </div>

      <div 
        ref={roadmapRef}
        className="relative overflow-auto border rounded-lg bg-background/50 p-6"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: zoom < 1 ? `${100 / zoom}%` : 'auto',
          width: zoom < 1 ? `${100 / zoom}%` : 'auto'
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {mockRoadmapData.map((quarter) => (
            <Card key={quarter.id} className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{quarter.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quarter.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 border-l-4 rounded-r-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer ${getPriorityColor(task.priority)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-medium ${zoom < 0.75 ? 'text-xs' : 'text-sm'}`}>
                        {task.title}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(task.status)} ${zoom < 0.75 ? 'text-xs px-1 py-0' : 'text-xs'}`}
                      >
                        {task.status}
                      </Badge>
                    </div>
                    {zoom >= 0.75 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-red-500' :
                          task.priority === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        <span>{task.priority} priority</span>
                      </div>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Task
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <RoadmapZoomControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />
    </div>
  );
}

interface ChallengeResearch {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: "challenge" | "research";
  stakeholder: string;
  impact: string;
  requirements: string;
  posted: string;
}

function ChallengeModal({ 
  item, 
  isOpen, 
  onClose 
}: { 
  item: ChallengeResearch | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const [showTeamForm, setShowTeamForm] = useState(false);
  
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <span className="text-xl">{item.title}</span>
              <div className="flex gap-2 mt-2">
                {item.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
            <Badge variant={item.type === "challenge" ? "destructive" : "default"}>
              {item.type === "challenge" ? "Industry Challenge" : "Research Solution"}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{item.description}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Stakeholder
              </h3>
              <p className="text-sm text-muted-foreground">{item.stakeholder}</p>
              <p className="text-xs text-muted-foreground mt-1">Posted {item.posted}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Potential Impact
              </h3>
              <p className="text-sm text-muted-foreground">{item.impact}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Requirements & Expectations</h3>
            <p className="text-sm text-muted-foreground">{item.requirements}</p>
          </div>
          
          {!showTeamForm ? (
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                onClick={() => setShowTeamForm(true)}
                className="flex-1"
              >
                <Users className="w-4 h-4 mr-2" />
                Form a Team
              </Button>
              <Button variant="outline">
                <BookmarkPlus className="w-4 h-4 mr-2" />
                Save for Later
              </Button>
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Mentor
              </Button>
            </div>
          ) : (
            <TeamFormationWizard 
              challengeTitle={item.title}
              onBack={() => setShowTeamForm(false)}
              onComplete={() => {
                toast.success("Team created successfully!");
                setShowTeamForm(false);
                onClose();
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TeamFormationWizard({ 
  challengeTitle, 
  onBack, 
  onComplete 
}: { 
  challengeTitle: string; 
  onBack: () => void; 
  onComplete: () => void;
}) {
  const [teamData, setTeamData] = useState({
    teamName: "",
    myRole: "",
    description: "",
    lookingFor: ""
  });

  const roles = ["Tech Lead", "Researcher", "Designer", "Product Manager", "Business Development"];

  return (
    <div className="space-y-6 pt-4 border-t">
      <div>
        <h3 className="font-semibold mb-2">Create Team for: {challengeTitle}</h3>
        <p className="text-sm text-muted-foreground">Form a startup team to tackle this challenge together</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="teamName">Team Name</Label>
          <Input
            id="teamName"
            value={teamData.teamName}
            onChange={(e) => setTeamData(prev => ({ ...prev, teamName: e.target.value }))}
            placeholder="e.g., PowerTech Innovations"
          />
        </div>
        
        <div>
          <Label htmlFor="myRole">Your Role</Label>
          <Select value={teamData.myRole} onValueChange={(value) => setTeamData(prev => ({ ...prev, myRole: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Team Vision</Label>
        <Textarea
          id="description"
          value={teamData.description}
          onChange={(e) => setTeamData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your approach to solving this challenge..."
          className="min-h-[80px]"
        />
      </div>
      
      <div>
        <Label htmlFor="lookingFor">Looking for Team Members</Label>
        <Textarea
          id="lookingFor"
          value={teamData.lookingFor}
          onChange={(e) => setTeamData(prev => ({ ...prev, lookingFor: e.target.value }))}
          placeholder="What skills and expertise are you seeking? e.g., RF Engineers, UI/UX Designer..."
          className="min-h-[60px]"
        />
      </div>
      
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          Back to Details
        </Button>
        <Button onClick={onComplete} className="flex-1">
          <ArrowRight className="w-4 h-4 mr-2" />
          Create Team & Start Project
        </Button>
      </div>
    </div>
  );
}

function IdeaCanvas({ onSave }: { onSave: (idea: StartupIdea) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    problem: "",
    solution: "",
    targetMarket: "",
    team: "",
    stage: "idea" as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.problem.trim()) {
      toast.error("Please fill in at least title and problem");
      return;
    }
    
    const saved = startupStorage.saveIdea(formData);
    onSave(saved);
    setFormData({ title: "", problem: "", solution: "", targetMarket: "", team: "", stage: "idea" });
    toast.success("Startup idea saved successfully!");
  };

  const generateSuggestions = () => {
    const suggestions = [
      "Consider conducting user interviews to validate your problem hypothesis",
      "Research competitor pricing and positioning strategies",
      "Create a minimal viable product (MVP) roadmap",
      "Identify key metrics to track for product-market fit"
    ];
    toast.success(`AI Suggestion: ${suggestions[Math.floor(Math.random() * suggestions.length)]}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Startup Name/Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., EcoTrack - Carbon Footprint App"
          className="mt-1"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="problem">Problem Statement</Label>
          <Textarea
            id="problem"
            value={formData.problem}
            onChange={(e) => setFormData(prev => ({ ...prev, problem: e.target.value }))}
            placeholder="What problem are you solving?"
            className="mt-1 min-h-[100px]"
          />
        </div>
        <div>
          <Label htmlFor="solution">Solution</Label>
          <Textarea
            id="solution"
            value={formData.solution}
            onChange={(e) => setFormData(prev => ({ ...prev, solution: e.target.value }))}
            placeholder="How will you solve this problem?"
            className="mt-1 min-h-[100px]"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="market">Target Market</Label>
          <Textarea
            id="market"
            value={formData.targetMarket}
            onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
            placeholder="Who are your customers?"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="team">Team & Skills</Label>
          <Textarea
            id="team"
            value={formData.team}
            onChange={(e) => setFormData(prev => ({ ...prev, team: e.target.value }))}
            placeholder="Team members and required skills"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="stage">Current Stage</Label>
        <Select value={formData.stage} onValueChange={(value: any) => setFormData(prev => ({ ...prev, stage: value }))}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="idea">Idea</SelectItem>
            <SelectItem value="validation">Validation</SelectItem>
            <SelectItem value="prototype">Prototype</SelectItem>
            <SelectItem value="launched">Launched</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          <Plus className="w-4 h-4 mr-2" />
          Save Startup Idea
        </Button>
        <Button type="button" variant="outline" onClick={generateSuggestions}>
          <Sparkles className="w-4 h-4 mr-2" />
          AI Suggestions
        </Button>
      </div>
    </form>
  );
}

export default function StartupLab() {
  const [ideas, setIdeas] = useState<StartupIdea[]>(() => startupStorage.getIdeas());
  const [selectedItem, setSelectedItem] = useState<ChallengeResearch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIdeaSaved = (newIdea: StartupIdea) => {
    setIdeas(prev => [...prev, newIdea]);
  };

  const openModal = (item: ChallengeResearch) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Startup Lab</h1>
        <p className="text-muted-foreground">
          Turn your ideas into reality. Create startup profiles, get AI-powered insights, and connect with mentors.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Ideas Registered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ideas.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              In Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ideas.filter(idea => idea.stage === "validation").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Prototypes Built
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ideas.filter(idea => idea.stage === "prototype" || idea.stage === "launched").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Startup Ideas</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Idea Canvas
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Startup Idea</DialogTitle>
            </DialogHeader>
            <IdeaCanvas onSave={handleIdeaSaved} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Lightbulb className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No ideas yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start by creating your first startup idea canvas
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Create First Idea</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Startup Idea</DialogTitle>
                  </DialogHeader>
                  <IdeaCanvas onSave={handleIdeaSaved} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          ideas.map(idea => (
            <Card key={idea.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{idea.title}</CardTitle>
                  <Badge variant="secondary" className={stageColors[idea.stage]}>
                    {idea.stage}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {idea.problem}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {idea.solution && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      <strong>Solution:</strong> {idea.solution}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    Created {idea.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <StartupRoadmap />

      {/* Industry ↔ Academia Bridge */}
      <div className="mt-12">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-2xl font-bold">Industry ↔ Academia Bridge</h2>
          <p className="text-muted-foreground">Connect research with real-world applications and startup opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Industry Challenges
              </CardTitle>
              <CardDescription>Real problems seeking research solutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockChallenges.filter(item => item.type === "challenge").map(challenge => (
                <div 
                  key={challenge.id}
                  className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
                  onClick={() => openModal(challenge)}
                >
                  <h4 className="font-semibold">{challenge.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {challenge.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {challenge.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">by {challenge.stakeholder}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Post Challenge
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Research Solutions
              </CardTitle>
              <CardDescription>Academic innovations ready for industry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockChallenges.filter(item => item.type === "research").map(research => (
                <div 
                  key={research.id}
                  className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
                  onClick={() => openModal(research)}
                >
                  <h4 className="font-semibold">{research.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {research.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {research.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">by {research.stakeholder}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Submit Research
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ChallengeModal 
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}