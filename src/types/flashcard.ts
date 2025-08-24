export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  source: 'pdf' | 'lesson';
  sourceFileName?: string;
  cards: Flashcard[];
  createdAt: Date;
  reviewProgress: number; // 0-100 percentage
  totalReviews: number;
  correctReviews: number;
}

export interface ReviewSession {
  deckId: string;
  currentCardIndex: number;
  correctAnswers: number;
  totalAnswers: number;
  startTime: Date;
}