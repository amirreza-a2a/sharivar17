import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Highlighter,
  StickyNote,
  Edit3,
  Save,
  X,
  RotateCcw,
  Eye
} from "lucide-react";
import { JournalEntry } from "@/types/journal";
import { updateJournalEntry } from "@/utils/journalStorage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface JournalEntryCardProps {
  entry: JournalEntry;
  onUpdate?: (entry: JournalEntry) => void;
  onReviewMistakes?: (entry: JournalEntry) => void;
  onReviewHighlights?: (entry: JournalEntry) => void;
}

export function JournalEntryCard({ 
  entry, 
  onUpdate, 
  onReviewMistakes, 
  onReviewHighlights 
}: JournalEntryCardProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(entry.userNotes);
  const [isEditingTakeaway, setIsEditingTakeaway] = useState(false);
  const [editedTakeaway, setEditedTakeaway] = useState(entry.keyTakeaway || "");

  const handleSaveNotes = () => {
    updateJournalEntry(entry.id, { userNotes: editedNotes });
    setIsEditingNotes(false);
    onUpdate?.({ ...entry, userNotes: editedNotes });
    toast.success("Notes updated!");
  };

  const handleSaveTakeaway = () => {
    updateJournalEntry(entry.id, { keyTakeaway: editedTakeaway });
    setIsEditingTakeaway(false);
    onUpdate?.({ ...entry, keyTakeaway: editedTakeaway });
    toast.success("Key takeaway updated!");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="mb-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
      {/* Header */}
      <CardHeader className="gradient-muted">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-foreground mb-2">
              {entry.lessonTitle}
            </CardTitle>
            <Badge variant="secondary" className="mb-3">
              {entry.moduleTitle}
            </Badge>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(entry.completionDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{entry.timeSpent} min</span>
              </div>
            </div>
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted/30 stroke-current"
                fill="none"
                strokeWidth="3"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-success stroke-current transition-all duration-1000"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${entry.progressPercentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Key Points */}
        {entry.keyPoints.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <h3 className="font-semibold text-foreground">Key Points</h3>
            </div>
            <ul className="space-y-2 ml-7">
              {entry.keyPoints.map((point, index) => (
                <li key={index} className="text-muted-foreground flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mistakes */}
        {entry.mistakes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <h3 className="font-semibold text-foreground">
                  Challenges Spotted ({entry.mistakes.length})
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReviewMistakes?.(entry)}
                className="text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Review
              </Button>
            </div>
            <div className="ml-7 space-y-2">
              {entry.mistakes.slice(0, 3).map((mistake, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{mistake.description}</span>
                  <Badge variant="outline" className="text-xs">
                    {mistake.attempts} attempts
                  </Badge>
                </div>
              ))}
              {entry.mistakes.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{entry.mistakes.length - 3} more challenges
                </p>
              )}
            </div>
          </div>
        )}

        {/* Highlights */}
        {entry.highlights.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Highlighter className="w-5 h-5 text-info" />
                <h3 className="font-semibold text-foreground">
                  Highlights ({entry.highlights.length})
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReviewHighlights?.(entry)}
                className="text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                View All
              </Button>
            </div>
            <div className="ml-7 space-y-2">
              {entry.highlights.slice(0, 2).map((highlight, index) => (
                <div key={index} className="p-3 bg-info/5 border-l-4 border-info rounded text-sm">
                  <p className="text-foreground italic">"{highlight.text}"</p>
                </div>
              ))}
              {entry.highlights.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{entry.highlights.length - 2} more highlights
                </p>
              )}
            </div>
          </div>
        )}

        {/* User Notes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <StickyNote className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Personal Notes</h3>
            </div>
            {!isEditingNotes && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingNotes(true)}
                className="text-xs"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
          
          <div className="ml-7">
            {isEditingNotes ? (
              <div className="space-y-2">
                <Textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="Add your personal notes and reflections..."
                  className="min-h-[100px]"
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSaveNotes}>
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingNotes(false);
                      setEditedNotes(entry.userNotes);
                    }}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">
                {entry.userNotes || (
                  <span className="italic text-muted-foreground/60">
                    No personal notes yet. Click Edit to add your thoughts and reflections.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Key Takeaway */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">💡 Key Takeaway</h3>
            {!isEditingTakeaway && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingTakeaway(true)}
                className="text-xs"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
          
          {isEditingTakeaway ? (
            <div className="space-y-2">
              <Textarea
                value={editedTakeaway}
                onChange={(e) => setEditedTakeaway(e.target.value)}
                placeholder="What's one key thing you learned from this lesson?"
                className="min-h-[80px]"
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleSaveTakeaway}>
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditingTakeaway(false);
                    setEditedTakeaway(entry.keyTakeaway || "");
                  }}
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gradient-to-r from-primary/5 to-info/5 rounded-lg border">
              {entry.keyTakeaway || (
                <span className="italic text-muted-foreground/60">
                  What's one key thing you learned? Click Edit to add your takeaway.
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}