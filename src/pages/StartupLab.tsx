import { useState } from "react";
import { Plus, Lightbulb, Target, Users, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { startupStorage } from "@/utils/startupStorage";
import type { StartupIdea } from "@/types/startup";
import { toast } from "sonner";

const stageColors = {
  idea: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  validation: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", 
  prototype: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  launched: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
};

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

  const handleIdeaSaved = (newIdea: StartupIdea) => {
    setIdeas(prev => [...prev, newIdea]);
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
    </div>
  );
}