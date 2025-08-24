import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit3, Trash2, Plus } from "lucide-react";
import { Flashcard } from '@/types/flashcard';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: Flashcard[];
  deckTitle: string;
  onSave: (cards: Flashcard[], title: string) => void;
}

export const FlashcardModal = ({ isOpen, onClose, cards: initialCards, deckTitle, onSave }: FlashcardModalProps) => {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [title, setTitle] = useState(deckTitle);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set(initialCards.map(c => c.id)));
  const [editingCard, setEditingCard] = useState<string | null>(null);

  const toggleCardSelection = (cardId: string) => {
    const newSelection = new Set(selectedCards);
    if (newSelection.has(cardId)) {
      newSelection.delete(cardId);
    } else {
      newSelection.add(cardId);
    }
    setSelectedCards(newSelection);
  };

  const selectAll = () => {
    setSelectedCards(new Set(cards.map(c => c.id)));
  };

  const deselectAll = () => {
    setSelectedCards(new Set());
  };

  const updateCard = (cardId: string, updates: Partial<Flashcard>) => {
    setCards(cards.map(card => 
      card.id === cardId ? { ...card, ...updates } : card
    ));
    setEditingCard(null);
  };

  const deleteCard = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId));
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
  };

  const addNewCard = () => {
    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      front: '',
      back: ''
    };
    setCards([...cards, newCard]);
    setEditingCard(newCard.id);
    setSelectedCards(prev => new Set([...prev, newCard.id]));
  };

  const handleSave = () => {
    const selectedCardsList = cards.filter(card => selectedCards.has(card.id));
    onSave(selectedCardsList.filter(card => card.front.trim() && card.back.trim()), title);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🃏 Create Flashcard Deck
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Deck Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter deck title..."
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              {selectedCards.size} of {cards.length} cards selected
            </span>
            <Button variant="ghost" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="ghost" size="sm" onClick={deselectAll}>
              Deselect All
            </Button>
            <Button variant="ghost" size="sm" onClick={addNewCard} className="gap-1">
              <Plus className="h-3 w-3" />
              Add Card
            </Button>
          </div>

          <ScrollArea className="flex-1 border rounded-lg p-4">
            <div className="space-y-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`grid grid-cols-12 gap-4 p-4 border rounded-lg transition-colors ${
                    selectedCards.has(card.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                >
                  <div className="col-span-1 flex items-start justify-center pt-2">
                    <Checkbox
                      checked={selectedCards.has(card.id)}
                      onCheckedChange={() => toggleCardSelection(card.id)}
                    />
                  </div>
                  
                  <div className="col-span-5">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Front (Question/Term)
                    </label>
                    {editingCard === card.id ? (
                      <Textarea
                        value={card.front}
                        onChange={(e) => updateCard(card.id, { front: e.target.value })}
                        placeholder="Enter question or term..."
                        className="min-h-[60px]"
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="min-h-[60px] p-2 bg-muted/50 rounded cursor-pointer"
                        onClick={() => setEditingCard(card.id)}
                      >
                        {card.front || <span className="text-muted-foreground">Click to edit...</span>}
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-5">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Back (Answer/Definition)
                    </label>
                    {editingCard === card.id ? (
                      <Textarea
                        value={card.back}
                        onChange={(e) => updateCard(card.id, { back: e.target.value })}
                        placeholder="Enter answer or definition..."
                        className="min-h-[60px]"
                      />
                    ) : (
                      <div 
                        className="min-h-[60px] p-2 bg-muted/50 rounded cursor-pointer"
                        onClick={() => setEditingCard(card.id)}
                      >
                        {card.back || <span className="text-muted-foreground">Click to edit...</span>}
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-1 flex items-start justify-center gap-1 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCard(editingCard === card.id ? null : card.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCard(card.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {cards.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No flashcards yet.</p>
                  <Button variant="outline" onClick={addNewCard} className="mt-2 gap-1">
                    <Plus className="h-4 w-4" />
                    Add Your First Card
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={selectedCards.size === 0 || !title.trim()}
            className="bg-[#2979FF] hover:bg-[#2979FF]/90 text-white"
          >
            Save Deck ({selectedCards.size} cards)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};