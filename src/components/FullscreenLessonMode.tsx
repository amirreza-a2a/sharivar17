import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Clock,
  Trophy,
  Star,
  ArrowRight,
  MessageSquare,
  FolderOpen,
  Sidebar
} from "lucide-react";
import { SubLesson, UserProgress, Module, Lesson } from "@/types/lesson";
import { LessonContent } from "./LessonContent";
import { LessonChatAssistant } from "./LessonChatAssistant";
import { LessonResources } from "./LessonResources";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FullscreenLessonModeProps {
  isOpen: boolean;
  onClose: () => void;
  subLesson: SubLesson;
  moduleId: string;
  lessonId: string;
  userProgress: UserProgress;
  modules: Module[];
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function FullscreenLessonMode({
  isOpen,
  onClose,
  subLesson,
  moduleId,
  lessonId,
  userProgress,
  modules,
  onComplete,
  onNext,
  onPrevious
}: FullscreenLessonModeProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [showChatPanel, setShowChatPanel] = useState(true);
  const [showResourcePanel, setShowResourcePanel] = useState(true);

  // Calculate lesson progress
  useEffect(() => {
    const module = modules.find(m => m.id === moduleId);
    const lesson = module?.lessons.find(l => l.id === lessonId);
    if (lesson) {
      setLessonProgress(lesson.progress);
    }
  }, [modules, moduleId, lessonId]);

  // Handle scroll to fade header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen]);

  const handleLessonComplete = () => {
    onComplete();
    setShowSummary(true);
  };

  const handleContinueToNext = () => {
    setShowSummary(false);
    if (onNext) {
      onNext();
    } else {
      onClose();
    }
  };

  const handleReturnToDashboard = () => {
    setShowSummary(false);
    onClose();
  };

  if (!isOpen) return null;

  // Lesson Summary Screen
  if (showSummary) {
    return (
      <div className="fixed inset-0 z-50 bg-background animate-fade-in">
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* Success Animation */}
            <div className="relative">
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-success to-info rounded-full animate-pulse opacity-20"></div>
                <div className="absolute inset-4 bg-gradient-to-r from-success to-info rounded-full flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white animate-scale-in" />
                </div>
              </div>
            </div>

            {/* Completion Message */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold gradient-text">
                🎉 Great job!
              </h1>
              <p className="text-xl text-muted-foreground">
                You've completed "{subLesson.title}"
              </p>
            </div>

            {/* Progress Update */}
            <div className="bg-card border rounded-2xl p-8 space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">+25</div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-info">{Math.round(lessonProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Course Progress</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Course Progress</span>
                  <span>{Math.round(lessonProgress)}%</span>
                </div>
                <Progress value={lessonProgress} className="h-3" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {onNext && (
                <Button 
                  onClick={handleContinueToNext}
                  size="lg"
                  className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Continue to Next Lesson
                </Button>
              )}
              <Button 
                onClick={handleReturnToDashboard}
                variant="outline"
                size="lg"
                className="px-8 py-4 rounded-xl font-semibold"
              >
                Return to Lessons
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Fullscreen Lesson View
  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b">
        <div className="flex items-center justify-between p-4">
          {/* Left: Navigation */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-lg">{subLesson.title}</h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{subLesson.estimatedTime} min</span>
              </div>
            </div>
          </div>

          {/* Center: Progress */}
          <div className="flex-1 max-w-md mx-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(lessonProgress)}%</span>
              </div>
              <Progress value={lessonProgress} className="h-2" />
            </div>
          </div>

          {/* Right: Panel Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant={showChatPanel ? "default" : "outline"}
              size="sm"
              onClick={() => setShowChatPanel(!showChatPanel)}
              className="hidden md:flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </Button>
            <Button
              variant={showResourcePanel ? "default" : "outline"}
              size="sm"
              onClick={() => setShowResourcePanel(!showResourcePanel)}
              className="hidden md:flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              Resources
            </Button>
            
            {/* Mobile menu toggle */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
            >
              <Sidebar className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="h-[calc(100vh-73px)]">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full">
          {/* Left Panel: AI Chat Assistant */}
          {showChatPanel && (
            <>
              <ResizablePanel 
                defaultSize={25} 
                minSize={20} 
                maxSize={40}
                className="hidden md:block"
              >
                <LessonChatAssistant 
                  lessonTitle={subLesson.title}
                  lessonContent={subLesson.content}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Central Panel: Lesson Content */}
          <ResizablePanel 
            defaultSize={showChatPanel && showResourcePanel ? 50 : showChatPanel || showResourcePanel ? 75 : 100}
            minSize={30}
          >
            <div className="h-full flex flex-col bg-background">
              <ScrollArea className="flex-1">
                <div className="p-6">
                  <LessonContent
                    subLesson={subLesson}
                    moduleId={moduleId}
                    lessonId={lessonId}
                    userProgress={userProgress}
                    onComplete={handleLessonComplete}
                  />
                </div>
              </ScrollArea>
              
              {/* Bottom Navigation */}
              <div className="border-t bg-background/95 backdrop-blur-md p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    {onPrevious && (
                      <Button
                        variant="outline"
                        onClick={onPrevious}
                        className="flex items-center space-x-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    {!subLesson.completed && !subLesson.quiz && (
                      <Button 
                        onClick={handleLessonComplete}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-medium"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Mark as</span> Complete
                      </Button>
                    )}
                    
                    {onNext && subLesson.completed && (
                      <Button
                        onClick={onNext}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 font-medium"
                      >
                        <span className="hidden sm:inline">Next Lesson</span>
                        <span className="sm:hidden">Next</span>
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>

          {/* Right Panel: Resources */}
          {showResourcePanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel 
                defaultSize={25} 
                minSize={20} 
                maxSize={40}
                className="hidden md:block"
              >
                <LessonResources lessonTitle={subLesson.title} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>

        {/* Mobile Bottom Sheet for Chat and Resources */}
        <div className="md:hidden">
          {/* Mobile panels would be implemented as modal overlays or bottom sheets */}
        </div>
      </div>
    </div>
  );
}