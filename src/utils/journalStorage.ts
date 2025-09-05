import { JournalEntry, JournalStats, JournalMistake, JournalHighlight } from "@/types/journal";

const JOURNAL_STORAGE_KEY = "learning_journal_entries";
const JOURNAL_STATS_KEY = "learning_journal_stats";

export function getJournalEntries(): JournalEntry[] {
  const stored = localStorage.getItem(JOURNAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveJournalEntries(entries: JournalEntry[]): void {
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
}

export function getJournalStats(): JournalStats {
  const stored = localStorage.getItem(JOURNAL_STATS_KEY);
  if (stored) {
    const stats = JSON.parse(stored);
    // Convert date strings back to Date objects
    return {
      ...stats,
      lastStudyDate: new Date(stats.lastStudyDate)
    };
  }
  
  return {
    currentStreak: 0,
    mistakesFixed: 0,
    lessonsCompleted: 0,
    totalTimeSpent: 0,
    lastStudyDate: new Date()
  };
}

export function saveJournalStats(stats: JournalStats): void {
  localStorage.setItem(JOURNAL_STATS_KEY, JSON.stringify(stats));
}

export function createJournalEntry(
  lessonId: string,
  lessonTitle: string,
  moduleId: string,
  moduleTitle: string,
  timeSpent: number,
  keyPoints: string[] = [],
  mistakes: JournalMistake[] = []
): JournalEntry {
  const entries = getJournalEntries();
  
  const newEntry: JournalEntry = {
    id: `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    lessonId,
    lessonTitle,
    moduleId,
    moduleTitle,
    completionDate: new Date(),
    progressPercentage: 100,
    keyPoints,
    mistakes,
    userNotes: "",
    highlights: [],
    timeSpent,
    keyTakeaway: ""
  };
  
  entries.push(newEntry);
  saveJournalEntries(entries);
  
  // Update stats
  const stats = getJournalStats();
  const today = new Date();
  const lastStudy = new Date(stats.lastStudyDate);
  
  // Calculate streak
  const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
  let newStreak = stats.currentStreak;
  
  if (daysDiff === 0) {
    // Same day, keep streak
  } else if (daysDiff === 1) {
    // Next day, increment streak
    newStreak += 1;
  } else {
    // Gap in days, reset streak
    newStreak = 1;
  }
  
  const updatedStats: JournalStats = {
    currentStreak: newStreak,
    mistakesFixed: stats.mistakesFixed + mistakes.length,
    lessonsCompleted: stats.lessonsCompleted + 1,
    totalTimeSpent: stats.totalTimeSpent + timeSpent,
    lastStudyDate: today
  };
  
  saveJournalStats(updatedStats);
  
  return newEntry;
}

export function updateJournalEntry(entryId: string, updates: Partial<JournalEntry>): void {
  const entries = getJournalEntries();
  const index = entries.findIndex(entry => entry.id === entryId);
  
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates };
    saveJournalEntries(entries);
  }
}

export function addHighlightToEntry(entryId: string, highlight: Omit<JournalHighlight, "id">): void {
  const entries = getJournalEntries();
  const entry = entries.find(e => e.id === entryId);
  
  if (entry) {
    const newHighlight: JournalHighlight = {
      ...highlight,
      id: `highlight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    entry.highlights.push(newHighlight);
    saveJournalEntries(entries);
  }
}

export function addMistakeToEntry(entryId: string, mistake: Omit<JournalMistake, "id">): void {
  const entries = getJournalEntries();
  const entry = entries.find(e => e.id === entryId);
  
  if (entry) {
    const newMistake: JournalMistake = {
      ...mistake,
      id: `mistake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    entry.mistakes.push(newMistake);
    saveJournalEntries(entries);
    
    // Update stats
    const stats = getJournalStats();
    stats.mistakesFixed += 1;
    saveJournalStats(stats);
  }
}

export function getEntryByLessonId(lessonId: string): JournalEntry | undefined {
  const entries = getJournalEntries();
  return entries.find(entry => entry.lessonId === lessonId);
}

export function generateKeyPoints(lessonContent: string): string[] {
  // Simple extraction of key points from lesson content
  const points: string[] = [];
  
  // Look for headers and bullet points
  const lines = lessonContent.split('\n');
  for (const line of lines) {
    if (line.startsWith('##') || line.startsWith('###')) {
      points.push(line.replace(/#+\s*/, '').trim());
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      points.push(line.replace(/^[-*]\s*/, '').trim());
    }
  }
  
  // If no structured content, extract first few sentences
  if (points.length === 0) {
    const sentences = lessonContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    points.push(...sentences.slice(0, 3).map(s => s.trim()));
  }
  
  return points.slice(0, 5); // Max 5 key points
}
