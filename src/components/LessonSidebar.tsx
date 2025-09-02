import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronRight, 
  ChevronDown, 
  CheckCircle, 
  Circle, 
  PlayCircle,
  BookOpen,
  Lock,
  Trophy,
  Flame
} from "lucide-react";
import { Module, Lesson, SubLesson, UserProgress } from "@/types/lesson";
import { cn } from "@/lib/utils";

interface LessonSidebarProps {
  modules: Module[];
  userProgress: UserProgress;
  currentSubLessonId: string;
  onSubLessonSelect: (moduleId: string, lessonId: string, subLessonId: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  onEnterFullscreen?: () => void;
}

export function LessonSidebar({ 
  modules, 
  userProgress, 
  currentSubLessonId, 
  onSubLessonSelect,
  collapsed,
  onToggle,
  onEnterFullscreen 
}: LessonSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set([userProgress.currentModuleId])
  );
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set([userProgress.currentLessonId])
  );

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  const getSubLessonIcon = (subLesson: SubLesson) => {
    if (subLesson.completed) {
      return <CheckCircle className="w-4 h-4 text-success" />;
    }
    if (subLesson.id === currentSubLessonId) {
      return <PlayCircle className="w-4 h-4 text-primary" />;
    }
    return <Circle className="w-4 h-4 text-muted-foreground" />;
  };

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.completed) {
      return <CheckCircle className="w-4 h-4 text-success" />;
    }
    if (lesson.progress > 0) {
      return <PlayCircle className="w-4 h-4 text-info" />;
    }
    return <BookOpen className="w-4 h-4 text-muted-foreground" />;
  };

  if (collapsed) {
    return (
      <div className="w-14 border-r bg-card h-full flex flex-col">
        <div className="p-3">
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 flex flex-col items-center space-y-4 p-2">
          <div className="flex flex-col items-center space-y-1">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-bold">{userProgress.streakDays}</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-xs font-bold">{userProgress.totalXP}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-card h-full flex flex-col shadow-sm">
      {/* Header */}
      <div className="border-b p-6 gradient-muted">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xl text-foreground">Learning Path</h2>
          <Button variant="ghost" size="icon" onClick={onToggle} className="hover:bg-background/20">
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
        
        {/* User Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-background rounded-xl p-4 border border-border/50 shadow-sm">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="p-1 rounded-lg bg-warning/10">
                <Flame className="w-4 h-4 text-warning" />
              </div>
              <span className="font-bold text-lg text-foreground">{userProgress.streakDays}</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">Day Streak</span>
          </div>
          <div className="bg-background rounded-xl p-4 border border-border/50 shadow-sm">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="p-1 rounded-lg bg-warning/10">
                <Trophy className="w-4 h-4 text-warning" />
              </div>
              <span className="font-bold text-lg text-foreground">{userProgress.totalXP}</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">Total XP</span>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          className="w-full gradient-primary text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]" 
          onClick={() => {
            const currentModule = modules.find(m => m.id === userProgress.currentModuleId);
            const currentLesson = currentModule?.lessons.find(l => l.id === userProgress.currentLessonId);
            if (currentModule && currentLesson) {
              onSubLessonSelect(currentModule.id, currentLesson.id, userProgress.currentSubLessonId);
              if (onEnterFullscreen) {
                onEnterFullscreen();
              }
            }
          }}
        >
          Continue Learning
        </Button>
      </div>

      {/* Module Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {modules.map((module) => (
            <Collapsible 
              key={module.id}
              open={expandedModules.has(module.id)}
              onOpenChange={() => toggleModule(module.id)}
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start p-4 h-auto rounded-xl hover:bg-muted/50 transition-all duration-200",
                    !module.unlocked && "opacity-50",
                    expandedModules.has(module.id) && "bg-muted/30"
                  )}
                  disabled={!module.unlocked}
                >
                  <div className="flex items-center space-x-3 flex-1 text-left">
                    {!module.unlocked ? (
                      <div className="p-2 rounded-lg bg-muted">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-primary/10">
                        {expandedModules.has(module.id) ? (
                          <ChevronDown className="w-4 h-4 text-primary" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-primary" />
                        )}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-foreground mb-1">{module.title}</div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {module.lessons.length} lessons
                      </div>
                      {module.unlocked && (
                        <div className="space-y-1">
                          <Progress value={module.progress} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {Math.round(module.progress)}% complete
                          </div>
                        </div>
                      )}
                    </div>
                    {module.completed && (
                      <div className="p-1 rounded-full bg-success/10">
                        <CheckCircle className="w-5 h-5 text-success" />
                      </div>
                    )}
                  </div>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="ml-6 mt-3 space-y-2">
                {module.lessons.map((lesson) => (
                  <Collapsible
                    key={lesson.id}
                    open={expandedLessons.has(lesson.id)}
                    onOpenChange={() => toggleLesson(lesson.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start p-3 h-auto rounded-lg hover:bg-muted/50">
                        <div className="flex items-center space-x-3 flex-1 text-left">
                          {expandedLessons.has(lesson.id) ? (
                            <ChevronDown className="w-3 h-3 text-primary" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-primary" />
                          )}
                          {getLessonIcon(lesson)}
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground mb-1">{lesson.title}</div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-muted-foreground">{lesson.estimatedTime} min</span>
                              <Badge variant="outline" className="text-xs h-5">
                                {lesson.difficulty}
                              </Badge>
                            </div>
                            {lesson.progress > 0 && (
                              <Progress value={lesson.progress} className="h-1.5" />
                            )}
                          </div>
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="ml-8 mt-2 space-y-1">
                      {lesson.subLessons.map((subLesson) => (
                        <Button
                          key={subLesson.id}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start p-3 h-auto rounded-lg hover:bg-muted/50 transition-all duration-200",
                            subLesson.id === currentSubLessonId && "bg-primary/10 border border-primary/20 shadow-sm"
                          )}
                          onClick={() => onSubLessonSelect(module.id, lesson.id, subLesson.id)}
                        >
                          <div className="flex items-center space-x-3 text-left">
                            {getSubLessonIcon(subLesson)}
                            <div>
                              <div className="text-sm font-medium text-foreground">{subLesson.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {subLesson.estimatedTime} min
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}