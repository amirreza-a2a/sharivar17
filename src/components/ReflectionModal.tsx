import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  AlertTriangle,
  Highlighter,
  Lightbulb,
  Save,
  SkipForward
} from "lucide-react";
import { JournalEntry, JournalMistake } from "@/types/journal";
import { updateJournalEntry } from "@/utils/journalStorage";
import { toast } from "sonner";

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  journalEntry: JournalEntry;
  onSave?: (entry: JournalEntry) => void;
}

export function ReflectionModal({ 
  isOpen, 
  onClose, 
  journalEntry, 
  onSave 
}: ReflectionModalProps) {
  const [userNotes, setUserNotes] = useState(journalEntry.userNotes || "");
  const [keyTakeaway, setKeyTakeaway] = useState(journalEntry.keyTakeaway || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const updates = {
        userNotes,
        keyTakeaway
      };
      
      updateJournalEntry(journalEntry.id, updates);
      
      const updatedEntry = { ...journalEntry, ...updates };
      onSave?.(updatedEntry);
      
      toast.success("Reflection saved to your journal!");
      onClose();
    } catch (error) {
      toast.error("Failed to save reflection");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    toast.success("Journal entry created!");
    onClose();
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <span>Lesson Complete!</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lesson Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{journalEntry.lessonTitle}</h3>
                <Badge variant="secondary" className="mb-4">
                  {journalEntry.moduleTitle}
                </Badge>
                <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                  <span>📅 {new Date(journalEntry.completionDate).toLocaleDateString()}</span>
                  <span>⏱️ {formatTime(journalEntry.timeSpent)}</span>
                  <span>✅ 100% Complete</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto-Generated Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Key Points */}
            {journalEntry.keyPoints.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <h3 className="font-semibold">Key Points Covered</h3>
                  </div>
                  <ul className="space-y-2">
                    {journalEntry.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0"></span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Challenges/Mistakes */}
            {journalEntry.mistakes.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <h3 className="font-semibold">Learning Opportunities</h3>
                  </div>
                  <div className="space-y-2">
                    {journalEntry.mistakes.map((mistake, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{mistake.description}</span>
                        <Badge variant="outline" className="text-xs">
                          {mistake.attempts} attempts
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    Great job working through these challenges! They'll help reinforce your learning.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Highlights */}
            {journalEntry.highlights.length > 0 && (
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Highlighter className="w-5 h-5 text-info" />
                    <h3 className="font-semibold">Your Highlights</h3>
                  </div>
                  <div className="grid gap-3">
                    {journalEntry.highlights.map((highlight, index) => (
                      <div key={index} className="p-3 bg-info/5 border-l-4 border-info rounded">
                        <p className="text-sm italic">"{highlight.text}"</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Reflection Questions */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Time to Reflect</h3>
              </div>

              {/* Key Takeaway */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  💡 What's one key thing you learned from this lesson?
                </label>
                <Textarea
                  value={keyTakeaway}
                  onChange={(e) => setKeyTakeaway(e.target.value)}
                  placeholder="e.g., 'I learned that Ohm's Law helps calculate electrical resistance...'"
                  className="min-h-[80px]"
                />
              </div>

              {/* Personal Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  📝 Any additional thoughts, questions, or connections?
                </label>
                <Textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g., 'This reminds me of...', 'I want to explore more about...', 'This could be useful for...'"
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional: Add any personal insights, connections to other topics, or questions for later.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Skip Reflection
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 gradient-primary text-white"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save to Journal"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}