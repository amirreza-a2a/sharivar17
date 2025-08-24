import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Brain } from "lucide-react";
import { FlashcardDeck } from '@/types/flashcard';

interface FlashcardReviewProps {
  deck: FlashcardDeck;
  onComplete: (correctAnswers: number, totalAnswers: number) => void;
  onBack: () => void;
}

export const FlashcardReview = ({ deck, onComplete, onBack }: FlashcardReviewProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredCards, setAnsweredCards] = useState<boolean[]>(new Array(deck.cards.length).fill(false));
  const [showResults, setShowResults] = useState(false);

  const currentCard = deck.cards[currentCardIndex];
  const progress = ((currentCardIndex + (isFlipped ? 1 : 0)) / deck.cards.length) * 100;
  const totalAnswered = answeredCards.filter(Boolean).length;

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!answeredCards[currentCardIndex]) {
      setAnsweredCards(prev => {
        const newAnswered = [...prev];
        newAnswered[currentCardIndex] = true;
        return newAnswered;
      });
      
      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1);
      }
    }

    // Move to next card or show results
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setShowResults(true);
    }
  };

  const restartReview = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setCorrectAnswers(0);
    setAnsweredCards(new Array(deck.cards.length).fill(false));
    setShowResults(false);
  };

  const finishReview = () => {
    onComplete(correctAnswers, totalAnswered);
  };

  if (showResults) {
    const percentage = Math.round((correctAnswers / deck.cards.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                percentage >= 80 ? 'bg-[#00C853]/10' : percentage >= 60 ? 'bg-[#FF6D00]/10' : 'bg-destructive/10'
              }`}>
                {percentage >= 80 ? (
                  <CheckCircle className={`w-10 h-10 text-[#00C853]`} />
                ) : (
                  <Brain className={`w-10 h-10 ${percentage >= 60 ? 'text-[#FF6D00]' : 'text-destructive'}`} />
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2">Review Complete!</h2>
              <p className="text-muted-foreground">
                You got {correctAnswers} out of {deck.cards.length} cards correct
              </p>
            </div>

            <div className="mb-6">
              <Progress value={percentage} className="h-3 mb-2" />
              <p className="text-lg font-semibold">{percentage}% Accuracy</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={restartReview} className="flex-1 gap-2">
                <RotateCcw className="w-4 h-4" />
                Review Again
              </Button>
              <Button onClick={finishReview} className="flex-1 bg-[#2979FF] hover:bg-[#2979FF]/90">
                Finish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="font-semibold">{deck.title}</h1>
              <p className="text-sm text-muted-foreground">
                Card {currentCardIndex + 1} of {deck.cards.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="font-semibold">{Math.round(progress)}%</p>
          </div>
        </div>
        <Progress value={progress} className="mt-2 max-w-4xl mx-auto" />
      </div>

      {/* Flashcard */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <div className="w-full max-w-2xl">
          <Card 
            className="min-h-[400px] cursor-pointer transform transition-transform hover:scale-[1.02] shadow-lg"
            onClick={handleCardFlip}
          >
            <CardContent className="flex items-center justify-center min-h-[400px] p-8">
              <div className="text-center w-full">
                <div className="mb-4">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    isFlipped ? 'bg-[#00C853]/10' : 'bg-[#2979FF]/10'
                  }`}>
                    {isFlipped ? (
                      <CheckCircle className="w-6 h-6 text-[#00C853]" />
                    ) : (
                      <Brain className="w-6 h-6 text-[#2979FF]" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {isFlipped ? 'ANSWER' : 'QUESTION'}
                  </p>
                </div>
                
                <div className="text-xl font-medium leading-relaxed mb-6">
                  {isFlipped ? currentCard.back : currentCard.front}
                </div>
                
                {!isFlipped && (
                  <p className="text-sm text-muted-foreground">
                    Click to reveal answer
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Answer Buttons */}
          {isFlipped && (
            <div className="flex gap-4 mt-6 justify-center">
              <Button
                variant="outline"
                onClick={() => handleAnswer(false)}
                className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                size="lg"
              >
                <XCircle className="w-5 h-5" />
                Incorrect
              </Button>
              <Button
                onClick={() => handleAnswer(true)}
                className="gap-2 bg-[#00C853] hover:bg-[#00C853]/90"
                size="lg"
              >
                <CheckCircle className="w-5 h-5" />
                Correct
              </Button>
            </div>
          )}
          
          {/* Instructions */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            {!isFlipped ? (
              <p>Read the question and think about your answer, then click to flip</p>
            ) : (
              <p>Did you get it right? Be honest with yourself!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};