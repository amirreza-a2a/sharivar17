import { FlashcardDeck, Flashcard } from '@/types/flashcard';

const STORAGE_KEY = 'flashcard_decks';

export const flashcardStorage = {
  // Get all decks
  getDecks(): FlashcardDeck[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const decks = JSON.parse(stored);
    // Convert date strings back to Date objects
    return decks.map((deck: any) => ({
      ...deck,
      createdAt: new Date(deck.createdAt)
    }));
  },

  // Save a new deck
  saveDeck(deck: Omit<FlashcardDeck, 'id' | 'createdAt' | 'reviewProgress' | 'totalReviews' | 'correctReviews'>): FlashcardDeck {
    const decks = this.getDecks();
    const newDeck: FlashcardDeck = {
      ...deck,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      reviewProgress: 0,
      totalReviews: 0,
      correctReviews: 0
    };
    
    decks.push(newDeck);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
    return newDeck;
  },

  // Update deck progress
  updateDeckProgress(deckId: string, correctAnswers: number, totalAnswers: number) {
    const decks = this.getDecks();
    const deckIndex = decks.findIndex(d => d.id === deckId);
    
    if (deckIndex >= 0) {
      decks[deckIndex].totalReviews += totalAnswers;
      decks[deckIndex].correctReviews += correctAnswers;
      decks[deckIndex].reviewProgress = Math.round(
        (decks[deckIndex].correctReviews / decks[deckIndex].totalReviews) * 100
      );
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
    }
  },

  // Delete a deck
  deleteDeck(deckId: string) {
    const decks = this.getDecks().filter(d => d.id !== deckId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  },

  // Update deck cards
  updateDeck(deckId: string, updates: Partial<FlashcardDeck>) {
    const decks = this.getDecks();
    const deckIndex = decks.findIndex(d => d.id === deckId);
    
    if (deckIndex >= 0) {
      decks[deckIndex] = { ...decks[deckIndex], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
    }
  },

  // Mock flashcard extraction from text
  extractFlashcardsFromText(text: string, source: 'pdf' | 'lesson' = 'pdf'): Flashcard[] {
    // Simple mock extraction - in real app this would use AI
    const mockCards: Flashcard[] = [];
    
    // Extract key terms (this is a very basic implementation)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const keyPhrases = sentences.slice(0, 10); // Take first 10 sentences
    
    keyPhrases.forEach((sentence, index) => {
      const words = sentence.trim().split(' ');
      if (words.length > 5) {
        // Create a question from the sentence
        const keyTerm = words.find(w => w.length > 5) || words[0];
        mockCards.push({
          id: crypto.randomUUID(),
          front: `What is ${keyTerm}?`,
          back: sentence.trim()
        });
      }
    });

    // Add some domain-specific cards based on common terms
    const techTerms = [
      { front: 'What is a microcontroller?', back: 'A small computer on a single integrated circuit containing a processor core, memory, and programmable input/output peripherals.' },
      { front: 'What is PWM?', back: 'Pulse Width Modulation - a method of reducing the average power delivered by an electrical signal by effectively chopping it up into discrete parts.' },
      { front: 'What is GPIO?', back: 'General Purpose Input/Output - pins on a microcontroller that can be configured as either input or output pins.' }
    ];

    // Add relevant tech terms if the text mentions them
    techTerms.forEach(term => {
      if (text.toLowerCase().includes(term.front.toLowerCase().split(' ')[2])) {
        mockCards.push({
          id: crypto.randomUUID(),
          ...term
        });
      }
    });

    return mockCards.slice(0, 15); // Limit to 15 cards
  }
};