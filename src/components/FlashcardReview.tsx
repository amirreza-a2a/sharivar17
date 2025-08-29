import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw, Eye, EyeOff, Star } from "lucide-react";
import { FlashcardDeck, Flashcard } from "@/types/flashcard";

interface FlashcardReviewProps {
  deck: FlashcardDeck | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FlashcardReview({ deck, isOpen, onClose }: FlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setShowBack(false);
      setReviewedCards(new Set());
    }
  }, [isOpen, deck]);

  if (!deck || !deck.cards.length) return null;

  const currentCard = deck.cards[currentIndex];
  const progress = ((currentIndex + 1) / deck.cards.length) * 100;

  const handleNext = () => {
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowBack(false);
      setReviewedCards(prev => new Set([...prev, currentIndex]));
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowBack(false);
    }
  };

  const handleFlip = () => {
    setShowBack(!showBack);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowBack(false);
    setReviewedCards(new Set());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{deck.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {currentIndex + 1} of {deck.cards.length}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {deck.subject}
                </Badge>
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

        {/* Flashcard */}
        <div className="flex-1 min-h-[300px] max-h-[400px]">
          <Card 
            className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg"
            onClick={handleFlip}
          >
            <CardContent className="p-8 h-full flex flex-col justify-center items-center text-center relative">
              {/* Flip indicator */}
              <div className="absolute top-4 right-4">
                {showBack ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              {/* Card content */}
              <div className="space-y-4 w-full">
                <div className="text-lg font-medium text-primary mb-4">
                  {showBack ? "Answer" : "Question"}
                </div>
                
                <div className="text-xl leading-relaxed">
                  {showBack ? currentCard.back : currentCard.front}
                </div>

                {showBack && currentCard.extraNotes && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Extra Notes
                    </div>
                    <div className="text-sm leading-relaxed">
                      {currentCard.extraNotes}
                    </div>
                  </div>
                )}

                {!showBack && (
                  <div className="text-sm text-muted-foreground mt-4">
                    Click to reveal answer
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleFlip}>
              {showBack ? "Show Question" : "Show Answer"}
            </Button>
          </div>

          <Button
            onClick={handleNext}
            disabled={currentIndex === deck.cards.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Study complete message */}
        {currentIndex === deck.cards.length - 1 && reviewedCards.has(currentIndex) && (
          <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
            <Star className="w-6 h-6 text-success mx-auto mb-2" />
            <div className="text-success font-medium">Study session complete!</div>
            <div className="text-sm text-muted-foreground mt-1">
              You've reviewed all {deck.cards.length} cards
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}