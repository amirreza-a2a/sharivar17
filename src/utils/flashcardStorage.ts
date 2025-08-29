import { FlashcardDeck, Flashcard } from "@/types/flashcard";

// Mock data for demonstration
export const getMockDecks = (): FlashcardDeck[] => [
  {
    id: "1",
    name: "Introduction to Quantum Computing",
    description: "Essential concepts and terminology for quantum computing beginners",
    subject: "Physics",
    tags: ["quantum", "computing", "physics", "beginner"],
    cards: [
      {
        id: "1-1",
        front: "What is a qubit?",
        back: "A quantum bit - the basic unit of quantum information that can exist in superposition of 0 and 1 states simultaneously.",
        extraNotes: "Unlike classical bits, qubits can be in both states at once until measured."
      },
      {
        id: "1-2",
        front: "Define quantum entanglement",
        back: "A quantum phenomenon where particles become interconnected, and the quantum state of each particle cannot be described independently.",
        extraNotes: "Einstein called this 'spooky action at a distance'"
      }
    ],
    coverImage: "/api/placeholder/300/200",
    createdBy: "Dr. Sarah Chen",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    isPublic: true,
    allowCollaboration: false,
    shareCode: "QC2024",
    rating: 4.8,
    totalRatings: 156,
    downloads: 1240,
    isOwned: true
  },
  {
    id: "2",
    name: "Advanced React Patterns",
    description: "Modern React patterns including hooks, context, and performance optimization",
    subject: "Programming",
    tags: ["react", "javascript", "frontend", "advanced"],
    cards: [
      {
        id: "2-1",
        front: "What is the useCallback hook used for?",
        back: "useCallback returns a memoized callback function to prevent unnecessary re-renders of child components.",
        extraNotes: "Useful when passing callbacks to optimized child components that rely on reference equality"
      }
    ],
    coverImage: "/api/placeholder/300/200",
    createdBy: "Alex Rodriguez",
    createdAt: "2024-02-01T09:15:00Z",
    updatedAt: "2024-02-05T16:45:00Z",
    isPublic: true,
    allowCollaboration: true,
    shareCode: "REACT2024",
    rating: 4.6,
    totalRatings: 89,
    downloads: 567,
    isOwned: true
  },
  {
    id: "3",
    name: "Spanish Vocabulary - Intermediate",
    description: "Essential Spanish words and phrases for intermediate learners",
    subject: "Language",
    tags: ["spanish", "vocabulary", "intermediate"],
    cards: [
      {
        id: "3-1",
        front: "El ordenador",
        back: "Computer",
        extraNotes: "In Latin America, 'computadora' is more commonly used"
      }
    ],
    coverImage: "/api/placeholder/300/200",
    createdBy: "María González",
    createdAt: "2024-01-28T11:20:00Z",
    updatedAt: "2024-02-02T13:10:00Z",
    isPublic: true,
    allowCollaboration: false,
    rating: 4.9,
    totalRatings: 203,
    downloads: 890,
    isOwned: false
  }
];

export const getMockSharedDecks = (): FlashcardDeck[] => [
  {
    id: "4",
    name: "Machine Learning Fundamentals",
    description: "Core concepts in machine learning and AI",
    subject: "Computer Science",
    tags: ["ai", "machine-learning", "algorithms"],
    cards: [
      {
        id: "4-1",
        front: "What is overfitting?",
        back: "When a model learns the training data too well, including noise, leading to poor performance on new data.",
        extraNotes: "Can be prevented with regularization, cross-validation, and proper train/test splits"
      }
    ],
    coverImage: "/api/placeholder/300/200",
    createdBy: "Prof. Michael Johnson",
    createdAt: "2024-01-10T08:30:00Z",
    updatedAt: "2024-01-25T12:15:00Z",
    isPublic: true,
    allowCollaboration: true,
    rating: 4.7,
    totalRatings: 124,
    downloads: 756,
    isOwned: false
  },
  {
    id: "5",
    name: "Organic Chemistry Reactions",
    description: "Important organic chemistry reaction mechanisms",
    subject: "Chemistry",
    tags: ["chemistry", "organic", "reactions"],
    cards: [
      {
        id: "5-1",
        front: "What is an SN2 reaction?",
        back: "A nucleophilic substitution reaction that occurs in one step with inversion of configuration.",
        extraNotes: "Rate depends on both nucleophile and substrate concentrations"
      }
    ],
    coverImage: "/api/placeholder/300/200",
    createdBy: "Dr. Emily Watson",
    createdAt: "2024-02-03T14:45:00Z",
    updatedAt: "2024-02-08T10:20:00Z",
    isPublic: true,
    allowCollaboration: false,
    rating: 4.5,
    totalRatings: 67,
    downloads: 234,
    isOwned: false
  }
];

// Local storage functions
export const saveDecks = (decks: FlashcardDeck[]) => {
  localStorage.setItem('flashcard-decks', JSON.stringify(decks));
};

export const loadDecks = (): FlashcardDeck[] => {
  const saved = localStorage.getItem('flashcard-decks');
  return saved ? JSON.parse(saved) : getMockDecks();
};

export const saveDeck = (deck: FlashcardDeck) => {
  const decks = loadDecks();
  const existingIndex = decks.findIndex(d => d.id === deck.id);
  
  if (existingIndex >= 0) {
    decks[existingIndex] = deck;
  } else {
    decks.push(deck);
  }
  
  saveDecks(decks);
};

export const deleteDeck = (deckId: string) => {
  const decks = loadDecks().filter(d => d.id !== deckId);
  saveDecks(decks);
};

export const cloneDeck = (originalDeck: FlashcardDeck): FlashcardDeck => {
  return {
    ...originalDeck,
    id: `${originalDeck.id}-clone-${Date.now()}`,
    name: `${originalDeck.name} (Copy)`,
    createdBy: "You",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isOwned: true,
    isPublic: false,
    shareCode: undefined,
    downloads: 0,
    rating: 0,
    totalRatings: 0
  };
};