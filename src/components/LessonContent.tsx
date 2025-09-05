import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  BookOpen, 
  Download, 
  FileText, 
  Code, 
  Video, 
  CheckCircle,
  Trophy,
  Lightbulb,
  StickyNote,
  Highlighter
} from "lucide-react";
import { SubLesson, Quiz, LessonResource, UserProgress } from "@/types/lesson";
import { toast } from "sonner";
import { addNote, completeSubLesson } from "@/utils/lessonStorage";
import { cn } from "@/lib/utils";
import { createJournalEntry, generateKeyPoints, addHighlightToEntry, getEntryByLessonId } from "@/utils/journalStorage";
import { ReflectionModal } from "./ReflectionModal";

interface LessonContentProps {
  subLesson: SubLesson;
  moduleId: string;
  lessonId: string;
  userProgress: UserProgress;
  onComplete: () => void;
}

export function LessonContent({ 
  subLesson, 
  moduleId, 
  lessonId, 
  userProgress, 
  onComplete 
}: LessonContentProps) {
  const [selectedText, setSelectedText] = useState("");
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [currentJournalEntry, setCurrentJournalEntry] = useState<any>(null);
  const [lessonStartTime] = useState(Date.now());

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 3) {
        setSelectedText(text);
      } else {
        setSelectedText("");
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleHighlight = () => {
    if (!selectedText) return;
    
    // Add to legacy notes system
    addNote({
      lessonId: subLesson.id,
      text: noteText || "Highlighted text",
      highlighted: selectedText
    });
    
    // Add to journal if entry exists
    const journalEntry = getEntryByLessonId(subLesson.id);
    if (journalEntry) {
      addHighlightToEntry(journalEntry.id, {
        text: selectedText,
        timestamp: new Date(),
        context: noteText || "Highlighted during lesson"
      });
    }
    
    toast.success("Text highlighted and saved to journal!");
    setSelectedText("");
    setNoteText("");
    setShowNoteDialog(false);
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null) return;
    
    setQuizSubmitted(true);
    const isCorrect = quizAnswer === subLesson.quiz?.correctAnswer;
    
    if (isCorrect) {
      toast.success("Correct! Well done!");
      setTimeout(() => {
        handleComplete();
      }, 2000);
    } else {
      toast.error("Not quite right. Try again!");
    }
  };

  const handleComplete = () => {
    completeSubLesson(moduleId, lessonId, subLesson.id);
    
    // Calculate time spent
    const timeSpent = Math.round((Date.now() - lessonStartTime) / (1000 * 60));
    
    // Generate key points from lesson content
    const keyPoints = generateKeyPoints(subLesson.content);
    
    // Create journal entry
    const journalEntry = createJournalEntry(
      subLesson.id,
      subLesson.title,
      moduleId,
      `Module ${moduleId}`, // You might want to get actual module title
      timeSpent,
      keyPoints,
      [] // Mistakes would be tracked during quiz attempts
    );
    
    setCurrentJournalEntry(journalEntry);
    setShowReflectionModal(true);
    
    toast.success("Lesson completed! +25 XP earned!");
  };

  const handleReflectionComplete = () => {
    setShowReflectionModal(false);
    onComplete();
  };

  const getResourceIcon = (type: LessonResource['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'slides': return <FileText className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-card p-8 gradient-muted">
        <div className="flex items-start justify-between max-w-6xl mx-auto">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4 text-foreground leading-tight">{subLesson.title}</h1>
            <div className="flex items-center space-x-6 text-muted-foreground">
              <div className="flex items-center space-x-2 bg-background/50 rounded-lg px-3 py-2">
                <Clock className="w-4 h-4 text-info" />
                <span className="font-medium">{subLesson.estimatedTime} min</span>
              </div>
              <div className="flex items-center space-x-2 bg-background/50 rounded-lg px-3 py-2">
                <BookOpen className="w-4 h-4 text-info" />
                <span className="font-medium">Interactive Lesson</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Progress Ring */}
          <div className="relative w-20 h-20 ml-6">
            <svg className="w-20 h-20 transform -rotate-90 lesson-progress-ring" viewBox="0 0 36 36">
              <path
                className="text-muted/30 stroke-current"
                fill="none"
                strokeWidth="2.5"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={cn(
                  "stroke-current transition-all duration-1000 ease-out",
                  subLesson.completed ? "text-success" : "text-primary"
                )}
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${subLesson.completed ? 100 : 70}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {subLesson.completed ? (
                <div className="p-2 rounded-full bg-success/10">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-lg font-bold text-primary">70%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-8 max-w-5xl mx-auto">
            {/* Video Player (if available) */}
            {subLesson.videoUrl && (
              <Card className="mb-8 overflow-hidden shadow-lg">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/5 to-info/5 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50"></div>
                    <div className="text-center relative z-10">
                      <div className="p-4 rounded-full bg-primary/10 mb-4 inline-block">
                        <Video className="w-12 h-12 text-primary" />
                      </div>
                      <p className="text-muted-foreground mb-4 font-medium">Interactive video lesson</p>
                      <Button className="gradient-primary text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                        <Video className="w-4 h-4 mr-2" />
                        Play Video
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Content */}
            <div className="lesson-content-wrapper mb-10">
              <div 
                className="lesson-content"
                dangerouslySetInnerHTML={{ 
                  __html: subLesson.content.replace(/\n/g, '<br>').replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/### (.*)/g, '<h3>$1</h3>').replace(/# (.*)/g, '<h1>$1</h1>')
                }}
              />
            </div>

            {/* Enhanced Text Selection Toolbar */}
            {selectedText && (
              <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
                <Card className="shadow-2xl border-2 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        className="gap-2 gradient-primary text-white font-medium rounded-lg px-4 py-2 hover:shadow-lg transition-all duration-200"
                        onClick={() => setShowNoteDialog(true)}
                      >
                        <Highlighter className="w-4 h-4" />
                        Highlight
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setNoteText(selectedText);
                          setShowNoteDialog(true);
                        }}
                        className="gap-2 font-medium rounded-lg px-4 py-2 hover:bg-muted transition-all duration-200"
                      >
                        <StickyNote className="w-4 h-4" />
                        Add Note
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Note Dialog */}
            {showNoteDialog && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-96">
                  <CardHeader>
                    <CardTitle>Add Note</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted rounded text-sm">
                      <strong>Selected text:</strong> "{selectedText}"
                    </div>
                    <Textarea
                      placeholder="Add your note..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                    <div className="flex space-x-2">
                      <Button onClick={handleHighlight} className="gap-2">
                        <StickyNote className="w-4 h-4" />
                        Save Note
                      </Button>
                      <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Enhanced Resources */}
            {subLesson.resources && subLesson.resources.length > 0 && (
              <Card className="mb-8 shadow-lg">
                <CardHeader className="gradient-muted">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-info/10">
                      <Download className="w-5 h-5 text-info" />
                    </div>
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    {subLesson.resources.map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-all duration-200 group">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors duration-200">
                            {getResourceIcon(resource.type)}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{resource.title}</div>
                            {resource.size && (
                              <div className="text-sm text-muted-foreground">{resource.size}</div>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Quiz Section */}
            {subLesson.quiz && !subLesson.completed && (
              <Card className="mb-8 shadow-lg overflow-hidden">
                <CardHeader className="gradient-primary text-white">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-white/20">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    Knowledge Check
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-xl font-bold text-foreground">{subLesson.quiz.question}</h3>
                  
                  <div className="space-y-4">
                    {subLesson.quiz.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={
                          quizSubmitted
                            ? index === subLesson.quiz!.correctAnswer
                              ? "default"
                              : index === quizAnswer
                              ? "destructive"
                              : "outline"
                            : quizAnswer === index
                            ? "secondary"
                            : "outline"
                        }
                        className={cn(
                          "w-full text-left justify-start p-6 h-auto rounded-xl font-medium transition-all duration-200",
                          quizSubmitted && index === subLesson.quiz!.correctAnswer && "gradient-success text-white shadow-lg",
                          quizSubmitted && index === quizAnswer && index !== subLesson.quiz!.correctAnswer && "bg-destructive text-destructive-foreground",
                          !quizSubmitted && quizAnswer === index && "bg-primary/10 border-primary text-primary font-semibold",
                          !quizSubmitted && quizAnswer !== index && "hover:bg-muted/50 hover:border-primary/30"
                        )}
                        onClick={() => !quizSubmitted && setQuizAnswer(index)}
                        disabled={quizSubmitted}
                      >
                        <div className="flex items-center">
                          <span className="mr-4 font-bold text-lg bg-muted rounded-full w-8 h-8 flex items-center justify-center">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-base">{option}</span>
                        </div>
                      </Button>
                    ))}
                  </div>

                  {quizSubmitted && subLesson.quiz.explanation && (
                    <div className="p-6 bg-info/5 border border-info/20 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-info/10">
                          <Lightbulb className="w-5 h-5 text-info" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Explanation</h4>
                          <p className="text-foreground leading-relaxed">{subLesson.quiz.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center pt-4">
                    <Button 
                      onClick={quizSubmitted ? handleComplete : handleQuizSubmit}
                      disabled={quizAnswer === null}
                      className={cn(
                        "gap-3 px-8 py-3 rounded-xl font-semibold transition-all duration-200",
                        quizSubmitted 
                          ? "gradient-success text-white shadow-lg hover:shadow-xl hover:scale-105" 
                          : "gradient-primary text-white shadow-lg hover:shadow-xl hover:scale-105"
                      )}
                      size="lg"
                    >
                      {quizSubmitted ? (
                        <>
                          <Trophy className="w-5 h-5" />
                          Complete Lesson
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Submit Answer
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Complete Button (for lessons without quiz) */}
            {!subLesson.quiz && !subLesson.completed && (
              <div className="text-center py-8">
                <Button 
                  onClick={handleComplete} 
                  size="lg" 
                  className="gap-3 px-12 py-4 rounded-xl font-semibold text-lg gradient-success text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
                >
                  <CheckCircle className="w-6 h-6" />
                  Mark as Complete
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Reflection Modal */}
      {showReflectionModal && currentJournalEntry && (
        <ReflectionModal
          isOpen={showReflectionModal}
          onClose={handleReflectionComplete}
          journalEntry={currentJournalEntry}
          onSave={handleReflectionComplete}
        />
      )}
    </div>
  );
}