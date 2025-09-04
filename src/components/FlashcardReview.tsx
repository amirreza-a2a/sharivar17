import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw, Eye, EyeOff, Star, BarChart3, AlertTriangle } from "lucide-react";
import { FlashcardDeck, Flashcard, ReviewResponse } from "@/types/flashcard";
import { updateCardAfterReview, getDueCards, initializeCard, calculateSessionStats } from "@/utils/srsLogic";
import { saveDeck } from "@/utils/flashcardStorage";
import { useToast } from "@/hooks/use-toast";

interface FlashcardReviewProps {
  deck: FlashcardDeck | null;
  isOpen: boolean;
  onClose: () => void;
  onDeckUpdate?: (updatedDeck: FlashcardDeck) => void;
}

export function FlashcardReview({ deck, isOpen, onClose, onDeckUpdate }: FlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<Array<{ card: Flashcard; response: ReviewResponse }>>([]);
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const { toast } = useToast();

  // Initialize due cards when deck changes
  useEffect(() => {
    if (deck && isOpen) {
      const initializedCards = deck.cards.map(initializeCard);
      const due = getDueCards(initializedCards);
      setDueCards(due);
      setCurrentIndex(0);
      setShowBack(false);
      setReviewedCards([]);
      setSessionComplete(false);
    }
  }, [isOpen, deck]);

  if (!deck || !deck.cards.length) return null;

  const currentCard = dueCards[currentIndex];
  const progress = dueCards.length > 0 ? ((currentIndex + 1) / dueCards.length) * 100 : 0;

  const handleReviewResponse = useCallback((response: ReviewResponse) => {
    if (!currentCard || !deck) return;

    // Update the card with SRS logic
    const updatedCard = updateCardAfterReview(currentCard, response);
    
    // Update the deck with the new card data
    const updatedCards = deck.cards.map(card => 
      card.id === currentCard.id ? updatedCard : card
    );
    const updatedDeck = { ...deck, cards: updatedCards };
    
    // Save to storage
    saveDeck(updatedDeck);
    onDeckUpdate?.(updatedDeck);

    // Track this review
    setReviewedCards(prev => [...prev, { card: currentCard, response }]);

    // Move to next card or complete session
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowBack(false);
    } else {
      // Session complete
      setSessionComplete(true);
      const stats = calculateSessionStats([...reviewedCards, { card: currentCard, response }]);
      
      toast({
        title: "Study Session Complete! 🎉",
        description: `Reviewed ${stats.cardsReviewed} cards with ${stats.accuracy}% accuracy`,
      });
    }
  }, [currentCard, deck, currentIndex, dueCards.length, onDeckUpdate, toast]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen || !showBack) return;
      
      switch (e.key) {
        case '1':
          handleReviewResponse('again');
          break;
        case '2':
          handleReviewResponse('hard');
          break;
        case '3':
          handleReviewResponse('good');
          break;
        case '4':
          handleReviewResponse('easy');
          break;
        case ' ':
          e.preventDefault();
          if (!showBack) {
            setShowBack(true);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, showBack, handleReviewResponse]);

  const handleFlip = () => {
    setShowBack(!showBack);
  };

  const handleRestart = () => {
    if (deck) {
      const due = getDueCards(deck.cards.map(initializeCard));
      setDueCards(due);
      setCurrentIndex(0);
      setShowBack(false);
      setReviewedCards([]);
      setSessionComplete(false);
    }
  };

  // If no due cards, show message
  if (dueCards.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">All Caught Up! 🎯</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <BarChart3 className="w-16 h-16 mx-auto text-primary mb-4" />
            <p className="text-muted-foreground mb-4">
              No cards are due for review right now. Come back later!
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (sessionComplete) {
    const stats = calculateSessionStats(reviewedCards);
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">Session Complete! 🌟</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6 space-y-4">
            <div className="text-6xl">🎉</div>
            <div className="space-y-2">
              <p className="text-xl font-semibold">Great work!</p>
              <p className="text-muted-foreground">
                You reviewed <span className="font-medium text-foreground">{stats.cardsReviewed}</span> cards
                with <span className="font-medium text-foreground">{stats.accuracy}%</span> accuracy
              </p>
            </div>
            
            {stats.troubleCards.length > 0 && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-warning mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Cards to review:</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {stats.troubleCards.length} cards marked for additional practice
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={handleRestart}>
                Study More
              </Button>
              <Button onClick={onClose}>Finish</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[95vh]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{deck.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {currentIndex + 1} of {dueCards.length}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {deck.subject}
                </Badge>
                {currentCard?.isLeech && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Difficult
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Restart
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Card Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Level: {currentCard?.level}/4</span>
          <span>Reviews: {currentCard?.timesReviewed}</span>
          {currentCard?.timesLapsed > 0 && (
            <span className="text-warning">Lapses: {currentCard.timesLapsed}</span>
          )}
        </div>

        {/* Flashcard */}
        <div className="flex-1 min-h-[320px] max-h-[400px]">
          <Card 
            className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg animate-fade-in"
            onClick={!showBack ? handleFlip : undefined}
          >
            <CardContent className="p-8 h-full flex flex-col justify-center items-center text-center relative">
              {/* Card content */}
              <div className="space-y-6 w-full">
                <div className="text-lg font-medium text-primary mb-4">
                  {showBack ? "Answer" : "Question"}
                </div>
                
                <div className="text-2xl leading-relaxed font-medium">
                  {showBack ? currentCard?.back : currentCard?.front}
                </div>

                {showBack && currentCard?.extraNotes && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Extra Notes
                    </div>
                    <div className="text-sm leading-relaxed">
                      {currentCard.extraNotes}
                    </div>
                  </div>
                )}

                {!showBack && (
                  <div className="text-sm text-muted-foreground mt-6">
                    <div className="mb-2">Click to reveal answer</div>
                    <div className="text-xs opacity-70">Or press Space</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Review Buttons */}
        {showBack ? (
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              How well did you know this card?
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={() => handleReviewResponse('again')}
                variant="outline"
                className="h-auto py-4 px-3 flex-col gap-2 border-destructive/20 hover:bg-destructive/10 hover:border-destructive/40"
              >
                <span className="text-lg font-bold text-destructive">1</span>
                <div className="text-center">
                  <div className="font-medium text-destructive">Again</div>
                  <div className="text-xs text-muted-foreground">&lt; 15m</div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleReviewResponse('hard')}
                variant="outline"
                className="h-auto py-4 px-3 flex-col gap-2 border-warning/20 hover:bg-warning/10 hover:border-warning/40"
              >
                <span className="text-lg font-bold text-warning">2</span>
                <div className="text-center">
                  <div className="font-medium text-warning">Hard</div>
                  <div className="text-xs text-muted-foreground">1 day</div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleReviewResponse('good')}
                variant="outline"
                className="h-auto py-4 px-3 flex-col gap-2 border-success/20 hover:bg-success/10 hover:border-success/40"
              >
                <span className="text-lg font-bold text-success">3</span>
                <div className="text-center">
                  <div className="font-medium text-success">Good</div>
                  <div className="text-xs text-muted-foreground">4 days</div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleReviewResponse('easy')}
                variant="outline"
                className="h-auto py-4 px-3 flex-col gap-2 border-primary/20 hover:bg-primary/10 hover:border-primary/40"
              >
                <span className="text-lg font-bold text-primary">4</span>
                <div className="text-center">
                  <div className="font-medium text-primary">Easy</div>
                  <div className="text-xs text-muted-foreground">14 days</div>
                </div>
              </Button>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              Use keyboard shortcuts: 1, 2, 3, 4
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button onClick={handleFlip} size="lg" className="px-8">
              <Eye className="w-4 h-4 mr-2" />
              Reveal Answer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}