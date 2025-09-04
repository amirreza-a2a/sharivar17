import { Flashcard, ReviewResponse, SRSSettings } from "@/types/flashcard";

// Default SRS settings
export const defaultSRSSettings: SRSSettings = {
  againInterval: 0.25, // 15 minutes (in hours)
  hardInterval: 1, // 1 day
  goodInterval: 4, // 4 days
  easyInterval: 14, // 14 days
  maxDailyReviews: 50,
  leechThreshold: 8 // Mark as leech after 8 lapses
};

// Calculate next review date based on response
export function calculateNextReviewDate(
  card: Flashcard, 
  response: ReviewResponse,
  settings: SRSSettings = defaultSRSSettings
): Date {
  const now = new Date();
  let intervalDays = 0;

  switch (response) {
    case 'again':
      // Reset to level 1, show again in current session or same day
      intervalDays = settings.againInterval / 24; // Convert hours to days
      break;
    case 'hard':
      // Level 2, next review tomorrow
      intervalDays = settings.hardInterval;
      break;
    case 'good':
      // Level 3, next review in 4 days
      intervalDays = settings.goodInterval;
      break;
    case 'easy':
      // Level 4, next review in 14 days
      intervalDays = settings.easyInterval;
      break;
  }

  // Apply some spacing based on card's current level for progressive difficulty
  const levelMultiplier = Math.pow(1.3, card.level - 1);
  intervalDays *= levelMultiplier;

  const nextDate = new Date(now.getTime() + (intervalDays * 24 * 60 * 60 * 1000));
  return nextDate;
}

// Update card after review
export function updateCardAfterReview(
  card: Flashcard, 
  response: ReviewResponse,
  settings: SRSSettings = defaultSRSSettings
): Flashcard {
  const now = new Date().toISOString();
  const nextReviewDate = calculateNextReviewDate(card, response, settings);
  
  let newLevel = card.level;
  let newLapses = card.timesLapsed;

  // Update level based on response
  switch (response) {
    case 'again':
      newLevel = 1;
      newLapses += 1;
      break;
    case 'hard':
      newLevel = Math.max(1, Math.min(2, card.level)); // Stay at level 2 or go down
      break;
    case 'good':
      newLevel = Math.min(4, card.level + 1); // Move up one level, max 4
      break;
    case 'easy':
      newLevel = 4; // Jump to highest level
      break;
  }

  // Check if card should be marked as leech
  const isLeech = newLapses >= settings.leechThreshold;

  return {
    ...card,
    level: newLevel,
    nextReviewDate: nextReviewDate.toISOString(),
    lastReviewDate: now,
    timesReviewed: card.timesReviewed + 1,
    timesLapsed: newLapses,
    isLeech
  };
}

// Get cards due for review
export function getDueCards(cards: Flashcard[]): Flashcard[] {
  const now = new Date();
  return cards
    .filter(card => new Date(card.nextReviewDate) <= now)
    .sort((a, b) => {
      // Prioritize lower level cards (harder ones)
      if (a.level !== b.level) {
        return a.level - b.level;
      }
      // Then by next review date
      return new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime();
    });
}

// Initialize card with SRS data if missing
export function initializeCard(card: Flashcard): Flashcard {
  const now = new Date().toISOString();
  
  return {
    ...card,
    level: card.level || 1,
    nextReviewDate: card.nextReviewDate || now,
    lastReviewDate: card.lastReviewDate,
    timesReviewed: card.timesReviewed || 0,
    timesLapsed: card.timesLapsed || 0,
    isLeech: card.isLeech || false
  };
}

// Calculate session statistics
export function calculateSessionStats(
  reviewedCards: Array<{ card: Flashcard; response: ReviewResponse }>
) {
  const totalCards = reviewedCards.length;
  const correctCards = reviewedCards.filter(r => 
    r.response === 'good' || r.response === 'easy'
  ).length;
  const troubleCards = reviewedCards
    .filter(r => r.response === 'again')
    .map(r => r.card);

  return {
    cardsReviewed: totalCards,
    accuracy: totalCards > 0 ? Math.round((correctCards / totalCards) * 100) : 0,
    troubleCards,
    completedAt: new Date().toISOString()
  };
}