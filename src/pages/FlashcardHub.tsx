import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  FileText, 
  BookOpen, 
  Play, 
  Edit3, 
  Trash2,
  Plus,
  Target
} from "lucide-react";
import { FlashcardDeck } from '@/types/flashcard';
import { flashcardStorage } from '@/utils/flashcardStorage';
import { FlashcardReview } from '@/components/FlashcardReview';
import { toast } from "sonner";

export default function FlashcardHub() {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [reviewingDeck, setReviewingDeck] = useState<FlashcardDeck | null>(null);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = () => {
    const savedDecks = flashcardStorage.getDecks();
    setDecks(savedDecks);
  };

  const handleDeleteDeck = (deckId: string) => {
    if (confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      flashcardStorage.deleteDeck(deckId);
      loadDecks();
      toast.success("Deck deleted successfully");
    }
  };

  const startReview = (deck: FlashcardDeck) => {
    if (deck.cards.length === 0) {
      toast.error("This deck has no cards to review");
      return;
    }
    setReviewingDeck(deck);
  };

  const onReviewComplete = (correctAnswers: number, totalAnswers: number) => {
    if (reviewingDeck) {
      flashcardStorage.updateDeckProgress(reviewingDeck.id, correctAnswers, totalAnswers);
      loadDecks();
      toast.success(`Review complete! ${correctAnswers}/${totalAnswers} correct`);
    }
    setReviewingDeck(null);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'lesson': return <BookOpen className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (reviewingDeck) {
    return (
      <FlashcardReview
        deck={reviewingDeck}
        onComplete={onReviewComplete}
        onBack={() => setReviewingDeck(null)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            🃏 Flashcard Decks
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and practice with your personalized flashcard decks
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = '/dashboard/pdf'}
          className="gap-2 bg-[#2979FF] hover:bg-[#2979FF]/90"
        >
          <Plus className="w-4 h-4" />
          Create New Deck
        </Button>
      </div>

      {/* Stats Overview */}
      {decks.length > 0 && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-[#2979FF]" />
                <div>
                  <p className="text-2xl font-bold">{decks.length}</p>
                  <p className="text-sm text-muted-foreground">Total Decks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#00C853]" />
                <div>
                  <p className="text-2xl font-bold">
                    {decks.reduce((sum, deck) => sum + deck.cards.length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Cards</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-[#FF6D00]" />
                <div>
                  <p className="text-2xl font-bold">
                    {decks.reduce((sum, deck) => sum + deck.totalReviews, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Reviews Done</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#9C27B0]" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      decks.length > 0 
                        ? decks.reduce((sum, deck) => sum + deck.reviewProgress, 0) / decks.length 
                        : 0
                    )}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Deck Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <Card key={deck.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold mb-2">
                    {deck.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getSourceIcon(deck.source)}
                    <span className="capitalize">{deck.source}</span>
                    {deck.sourceFileName && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[120px]" title={deck.sourceFileName}>
                          {deck.sourceFileName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDeck(deck.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{deck.reviewProgress}%</span>
                </div>
                <Progress 
                  value={deck.reviewProgress} 
                  className="h-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Cards</p>
                  <p className="font-semibold">{deck.cards.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reviews</p>
                  <p className="font-semibold">{deck.totalReviews}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => startReview(deck)}
                  className="flex-1 bg-[#2979FF] hover:bg-[#2979FF]/90"
                  size="sm"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Review Now
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Created {deck.createdAt.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {decks.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="bg-[#2979FF]/10 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Brain className="w-12 h-12 text-[#2979FF]" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4">No Flashcard Decks Yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first deck by uploading a PDF or generating cards from lesson content. 
            Turn any learning material into interactive flashcards!
          </p>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={() => window.location.href = '/dashboard/pdf'}
              className="gap-2 bg-[#2979FF] hover:bg-[#2979FF]/90"
            >
              <FileText className="w-4 h-4" />
              Upload PDF
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/dashboard/learning-path'}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Browse Lessons
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}