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
    
    addNote({
      lessonId: subLesson.id,
      text: noteText || "Highlighted text",
      highlighted: selectedText
    });
    
    toast.success("Text highlighted and saved!");
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
    toast.success("Lesson completed! +25 XP earned!");
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
      <div className="border-b bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{subLesson.title}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{subLesson.estimatedTime} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>Interactive Lesson</span>
              </div>
            </div>
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted stroke-current"
                fill="none"
                strokeWidth="3"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary stroke-current"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${subLesson.completed ? 100 : 70}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {subLesson.completed ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <span className="text-sm font-bold">70%</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 max-w-4xl mx-auto">
            {/* Video Player (if available) */}
            {subLesson.videoUrl && (
              <Card className="mb-6">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">Video player would be embedded here</p>
                      <Button variant="outline" className="mt-2">
                        Play Video
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div 
                className="lesson-content"
                dangerouslySetInnerHTML={{ 
                  __html: subLesson.content.replace(/\n/g, '<br>').replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/### (.*)/g, '<h3>$1</h3>').replace(/# (.*)/g, '<h1>$1</h1>')
                }}
              />
            </div>

            {/* Text Selection Toolbar */}
            {selectedText && (
              <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
                <Card className="shadow-lg">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowNoteDialog(true)}
                        className="gap-2"
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
                        className="gap-2"
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

            {/* Resources */}
            {subLesson.resources && subLesson.resources.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {subLesson.resources.map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getResourceIcon(resource.type)}
                          <div>
                            <div className="font-medium">{resource.title}</div>
                            {resource.size && (
                              <div className="text-sm text-muted-foreground">{resource.size}</div>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quiz Section */}
            {subLesson.quiz && !subLesson.completed && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Knowledge Check
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">{subLesson.quiz.question}</h3>
                  
                  <div className="space-y-3">
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
                        className="w-full text-left justify-start p-4 h-auto"
                        onClick={() => !quizSubmitted && setQuizAnswer(index)}
                        disabled={quizSubmitted}
                      >
                        <span className="mr-3 font-bold">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </Button>
                    ))}
                  </div>

                  {quizSubmitted && subLesson.quiz.explanation && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">{subLesson.quiz.explanation}</p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <div></div>
                    <Button 
                      onClick={quizSubmitted ? handleComplete : handleQuizSubmit}
                      disabled={quizAnswer === null}
                      className="gap-2"
                    >
                      {quizSubmitted ? (
                        <>
                          <Trophy className="w-4 h-4" />
                          Complete Lesson
                        </>
                      ) : (
                        "Submit Answer"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Complete Button (for lessons without quiz) */}
            {!subLesson.quiz && !subLesson.completed && (
              <div className="text-center">
                <Button onClick={handleComplete} size="lg" className="gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Mark as Complete
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}