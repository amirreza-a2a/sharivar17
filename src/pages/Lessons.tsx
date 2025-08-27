import { useState, useEffect } from "react";
import { LessonSidebar } from "@/components/LessonSidebar";
import { LessonContent } from "@/components/LessonContent";
import LessonChatbot from "@/components/LessonChatbot";
import { getMockModules, getUserProgress, saveUserProgress } from "@/utils/lessonStorage";
import { Module, UserProgress, SubLesson } from "@/types/lesson";

export default function Lessons() {
  const [modules] = useState<Module[]>(getMockModules());
  const [userProgress, setUserProgress] = useState<UserProgress>(getUserProgress());
  const [currentSubLesson, setCurrentSubLesson] = useState<SubLesson | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState(userProgress.currentModuleId);
  const [currentLessonId, setCurrentLessonId] = useState(userProgress.currentLessonId);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Load initial sub-lesson
    const module = modules.find(m => m.id === userProgress.currentModuleId);
    const lesson = module?.lessons.find(l => l.id === userProgress.currentLessonId);
    const subLesson = lesson?.subLessons.find(sl => sl.id === userProgress.currentSubLessonId);
    
    if (subLesson) {
      setCurrentSubLesson(subLesson);
    }
  }, [modules, userProgress]);

  const handleSubLessonSelect = (moduleId: string, lessonId: string, subLessonId: string) => {
    const module = modules.find(m => m.id === moduleId);
    const lesson = module?.lessons.find(l => l.id === lessonId);
    const subLesson = lesson?.subLessons.find(sl => sl.id === subLessonId);
    
    if (subLesson) {
      setCurrentSubLesson(subLesson);
      setCurrentModuleId(moduleId);
      setCurrentLessonId(lessonId);
      
      // Update user progress
      const newProgress = {
        ...userProgress,
        currentModuleId: moduleId,
        currentLessonId: lessonId,
        currentSubLessonId: subLessonId
      };
      setUserProgress(newProgress);
      saveUserProgress(newProgress);
    }
  };

  const handleLessonComplete = () => {
    // Refresh user progress after completion
    const updatedProgress = getUserProgress();
    setUserProgress(updatedProgress);
    
    // Auto-advance to next sub-lesson
    const module = modules.find(m => m.id === currentModuleId);
    const lesson = module?.lessons.find(l => l.id === currentLessonId);
    
    if (lesson && currentSubLesson) {
      const currentIndex = lesson.subLessons.findIndex(sl => sl.id === currentSubLesson.id);
      const nextSubLesson = lesson.subLessons[currentIndex + 1];
      
      if (nextSubLesson) {
        handleSubLessonSelect(currentModuleId, currentLessonId, nextSubLesson.id);
      }
    }
  };

  if (!currentSubLesson) {
    return (
      <div className="flex h-screen">
        <LessonSidebar
          modules={modules}
          userProgress={userProgress}
          currentSubLessonId=""
          onSubLessonSelect={handleSubLessonSelect}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Select a lesson to start learning</h2>
            <p className="text-muted-foreground">Choose a lesson from the sidebar to begin</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <LessonSidebar
        modules={modules}
        userProgress={userProgress}
        currentSubLessonId={currentSubLesson.id}
        onSubLessonSelect={handleSubLessonSelect}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content */}
      <LessonContent
        subLesson={currentSubLesson}
        moduleId={currentModuleId}
        lessonId={currentLessonId}
        userProgress={userProgress}
        onComplete={handleLessonComplete}
      />
      
      {/* AI Assistant */}
      <LessonChatbot lessonTitle={currentSubLesson.title} />
    </div>
  );
}