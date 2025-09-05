export interface Flashcard {
  id: string;
  front: string;
  back: string;
  extraNotes?: string;
  imageUrl?: string;
  audioUrl?: string;
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