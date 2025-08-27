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
}

export function LessonSidebar({ 
  modules, 
  userProgress, 
  currentSubLessonId, 
  onSubLessonSelect,
  collapsed,
  onToggle 
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
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (subLesson.id === currentSubLessonId) {
      return <PlayCircle className="w-4 h-4 text-primary" />;
    }
    return <Circle className="w-4 h-4 text-muted-foreground" />;
  };

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.completed) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (lesson.progress > 0) {
      return <PlayCircle className="w-4 h-4 text-primary" />;
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
    <div className="w-80 border-r bg-card h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Learning Path</h2>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
        
        {/* User Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center justify-center space-x-1 text-orange-500 mb-1">
              <Flame className="w-4 h-4" />
              <span className="font-bold">{userProgress.streakDays}</span>
            </div>
            <span className="text-xs text-muted-foreground">Day Streak</span>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="font-bold">{userProgress.totalXP}</span>
            </div>
            <span className="text-xs text-muted-foreground">Total XP</span>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          className="w-full mt-4" 
          onClick={() => {
            const currentModule = modules.find(m => m.id === userProgress.currentModuleId);
            const currentLesson = currentModule?.lessons.find(l => l.id === userProgress.currentLessonId);
            if (currentModule && currentLesson) {
              onSubLessonSelect(currentModule.id, currentLesson.id, userProgress.currentSubLessonId);
            }
          }}
        >
          Continue Learning
        </Button>
      </div>

      {/* Module Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
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
                    "w-full justify-start p-3 h-auto",
                    !module.unlocked && "opacity-50"
                  )}
                  disabled={!module.unlocked}
                >
                  <div className="flex items-center space-x-3 flex-1 text-left">
                    {!module.unlocked ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <>
                        {expandedModules.has(module.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </>
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{module.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {module.lessons.length} lessons
                      </div>
                      {module.unlocked && (
                        <Progress value={module.progress} className="mt-2 h-1" />
                      )}
                    </div>
                    {module.completed && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="ml-4 mt-2 space-y-1">
                {module.lessons.map((lesson) => (
                  <Collapsible
                    key={lesson.id}
                    open={expandedLessons.has(lesson.id)}
                    onOpenChange={() => toggleLesson(lesson.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                        <div className="flex items-center space-x-2 flex-1 text-left">
                          {expandedLessons.has(lesson.id) ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                          {getLessonIcon(lesson)}
                          <div className="flex-1">
                            <div className="text-sm font-medium">{lesson.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {lesson.estimatedTime} min • 
                              <Badge variant="outline" className="ml-1 text-xs">
                                {lesson.difficulty}
                              </Badge>
                            </div>
                            {lesson.progress > 0 && (
                              <Progress value={lesson.progress} className="mt-1 h-1" />
                            )}
                          </div>
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="ml-6 mt-1 space-y-1">
                      {lesson.subLessons.map((subLesson) => (
                        <Button
                          key={subLesson.id}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start p-2 h-auto",
                            subLesson.id === currentSubLessonId && "bg-primary/10 border border-primary/20"
                          )}
                          onClick={() => onSubLessonSelect(module.id, lesson.id, subLesson.id)}
                        >
                          <div className="flex items-center space-x-2 text-left">
                            {getSubLessonIcon(subLesson)}
                            <div>
                              <div className="text-sm">{subLesson.title}</div>
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