export interface LessonNote {
  id: string;
  lessonId: string;
  text: string;
  highlighted: string;
  timestamp: Date;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'slides' | 'code' | 'video';
  url: string;
  size?: string;
}

export interface SubLesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  estimatedTime: number;
  quiz?: Quiz;
  resources?: LessonResource[];
  completed: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  moduleId: string;
  description: string;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subLessons: SubLesson[];
  completed: boolean;
  progress: number; // 0-100
  xpReward: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  completed: boolean;
  progress: number; // 0-100
  unlocked: boolean;
}

export interface UserProgress {
  currentModuleId: string;
  currentLessonId: string;
  currentSubLessonId: string;
  totalXP: number;
  badges: string[];
  notes: LessonNote[];
  completedLessons: string[];
  streakDays: number;
  lastStudyDate: Date;
}