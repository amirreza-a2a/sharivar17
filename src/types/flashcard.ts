export interface Flashcard {
  id: string;
  front: string;
  back: string;
  extraNotes?: string;
  imageUrl?: string;
  audioUrl?: string;
  // SRS (Spaced Repetition System) data
  level: number; // 1-4 (Again, Hard, Good, Easy)
  nextReviewDate: string;
  lastReviewDate?: string;
  timesReviewed: number;
  timesLapsed: number; // Number of failed attempts
  isLeech?: boolean; // Cards repeatedly failed
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  subject: string;
  tags: string[];
  cards: Flashcard[];
  coverImage?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  allowCollaboration: boolean;
  shareCode?: string;
  rating: number;
  totalRatings: number;
  downloads: number;
  isOwned: boolean;
}

export interface FlashcardStats {
  studied: number;
  mastered: number;
  needsReview: number;
  lastStudied?: string;
}

export type DeckCategory = 'my-decks' | 'shared-decks' | 'import-decks';
export type SortOption = 'newest' | 'popular' | 'rating' | 'alphabetical';
export type ViewMode = 'grid' | 'list';

// SRS (Spaced Repetition System) types
export type ReviewResponse = 'again' | 'hard' | 'good' | 'easy';

export interface ReviewSession {
  deckId: string;
  cardsReviewed: number;
  accuracy: number;
  troubleCards: Flashcard[];
  completedAt: string;
}

export interface SRSSettings {
  againInterval: number; // hours
  hardInterval: number; // days  
  goodInterval: number; // days
  easyInterval: number; // days
  maxDailyReviews: number;
  leechThreshold: number; // number of lapses before marking as leech
}