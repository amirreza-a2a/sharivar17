export interface JournalHighlight {
  id: string;
  text: string;
  timestamp: Date;
  context: string; // Surrounding text for context
}

export interface JournalMistake {
  id: string;
  type: string;
  description: string;
  attempts: number;
  timestamp: Date;
  lesson: string;
}

export interface JournalEntry {
  id: string;
  lessonId: string;
  lessonTitle: string;
  moduleId: string;
  moduleTitle: string;
  completionDate: Date;
  progressPercentage: number;
  
  // Auto-generated content
  keyPoints: string[];
  mistakes: JournalMistake[];
  
  // User-generated content
  userNotes: string;
  highlights: JournalHighlight[];
  
  // Reflection
  keyTakeaway?: string;
  
  // Metrics
  timeSpent: number; // in minutes
  difficultyRating?: number; // 1-5
}

export interface JournalStats {
  currentStreak: number;
  mistakesFixed: number;
  lessonsCompleted: number;
  totalTimeSpent: number;
  lastStudyDate: Date;
}

export interface ReviewSession {
  id: string;
  type: 'mistakes' | 'highlights' | 'notes';
  entryIds: string[];
  createdAt: Date;
  completedAt?: Date;
}