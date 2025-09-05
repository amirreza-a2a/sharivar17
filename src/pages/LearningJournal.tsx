import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JournalDashboard } from "@/components/JournalDashboard";
import { 
  BookOpen, 
  RotateCcw, 
  Highlighter, 
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import { JournalEntry } from "@/types/journal";
import { useNavigate } from "react-router-dom";

export default function LearningJournal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleReviewMistakes = (entries: JournalEntry[]) => {
    // TODO: Implement mistake review mode
    console.log("Review mistakes for entries:", entries);
  };

  const handleReviewHighlights = (entries: JournalEntry[]) => {
    // TODO: Implement highlights review mode
    console.log("Review highlights for entries:", entries);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            Learning Journal
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personalized companion that captures your learning journey, 
            reflects on your progress, and helps you master new concepts.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="dashboard" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="mistakes" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Mistakes
            </TabsTrigger>
            <TabsTrigger value="highlights" className="gap-2">
              <Highlighter className="w-4 h-4" />
              Highlights
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <JournalDashboard
            onReviewMistakes={handleReviewMistakes}
            onReviewHighlights={handleReviewHighlights}
          />
        </TabsContent>

        {/* Mistakes Review Tab */}
        <TabsContent value="mistakes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5" />
                <span>Mistake Review Mode</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <RotateCcw className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mistake Review Coming Soon</h3>
                <p className="text-muted-foreground mb-6">
                  This feature will help you review and practice the concepts you found challenging.
                </p>
                <Button onClick={() => setActiveTab("dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Highlights Review Tab */}
        <TabsContent value="highlights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Highlighter className="w-5 h-5" />
                <span>Highlights Review Mode</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Highlighter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Highlights Review Coming Soon</h3>
                <p className="text-muted-foreground mb-6">
                  This feature will help you review all your highlighted text and notes in one place.
                </p>
                <Button onClick={() => setActiveTab("dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}