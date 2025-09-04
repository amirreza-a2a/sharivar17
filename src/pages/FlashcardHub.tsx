import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  Download, 
  Share2, 
  Play, 
  Copy,
  Upload,
  FileText,
  Users,
  Heart,
  Clock,
  BookOpen
} from "lucide-react";
import { FlashcardDeck, DeckCategory, SortOption, ViewMode } from "@/types/flashcard";
import { getMockDecks, getMockSharedDecks, loadDecks, saveDeck, cloneDeck } from "@/utils/flashcardStorage";
import { ShareModal } from "@/components/FlashcardModal";
import { FlashcardReview } from "@/components/FlashcardReview";
import { useToast } from "@/hooks/use-toast";

export default function FlashcardHub() {
  const [activeTab, setActiveTab] = useState<DeckCategory>("my-decks");
  const [myDecks, setMyDecks] = useState<FlashcardDeck[]>([]);
  const [sharedDecks] = useState<FlashcardDeck[]>(getMockSharedDecks());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [shareModalDeck, setShareModalDeck] = useState<FlashcardDeck | null>(null);
  const [reviewDeck, setReviewDeck] = useState<FlashcardDeck | null>(null);
  const [createDeckOpen, setCreateDeckOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");
  const [newDeckSubject, setNewDeckSubject] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setMyDecks(loadDecks());
  }, []);

  const subjects = ["all", "Physics", "Programming", "Language", "Chemistry", "Computer Science"];

  const filteredDecks = (decks: FlashcardDeck[]) => {
    return decks.filter(deck => {
      const matchesSearch = deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deck.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deck.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSubject = selectedSubject === "all" || deck.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    }).sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "popular":
          return b.downloads - a.downloads;
        case "rating":
          return b.rating - a.rating;
        case "alphabetical":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  const handleCreateDeck = () => {
    if (!newDeckName.trim()) return;

    const newDeck: FlashcardDeck = {
      id: `deck-${Date.now()}`,
      name: newDeckName,
      description: newDeckDescription,
      subject: newDeckSubject || "General",
      tags: [],
      cards: [],
      createdBy: "You",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false,
      allowCollaboration: false,
      rating: 0,
      totalRatings: 0,
      downloads: 0,
      isOwned: true
    };

    saveDeck(newDeck);
    setMyDecks([...myDecks, newDeck]);
    setCreateDeckOpen(false);
    setNewDeckName("");
    setNewDeckDescription("");
    setNewDeckSubject("");
    
    toast({
      title: "Deck created!",
      description: `"${newDeck.name}" has been created successfully.`,
    });
  };

  const handleCloneDeck = (deck: FlashcardDeck) => {
    const clonedDeck = cloneDeck(deck);
    saveDeck(clonedDeck);
    setMyDecks([...myDecks, clonedDeck]);
    
    toast({
      title: "Deck cloned!",
      description: `"${clonedDeck.name}" has been added to your collection.`,
    });
  };

  const DeckCard = ({ deck, showClone = false }: { deck: FlashcardDeck; showClone?: boolean }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 hover-scale">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold line-clamp-1">{deck.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{deck.description}</p>
          </div>
          {deck.isOwned && (
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setShareModalDeck(deck)}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">{deck.subject}</Badge>
          {deck.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{deck.cards.length} cards</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{deck.createdBy}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star className="w-4 h-4" />
            <span>{deck.rating.toFixed(1)} ({deck.totalRatings})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Download className="w-4 h-4" />
            <span>{deck.downloads}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => setReviewDeck(deck)}
        >
          <Play className="w-4 h-4 mr-1" />
          Study
        </Button>
        {showClone && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleCloneDeck(deck)}
          >
            <Copy className="w-4 h-4 mr-1" />
            Clone
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  const ImportSection = () => (
    <div className="space-y-6">
      <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Import Flashcard Decks</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Upload your existing flashcard decks from Anki (.apkg), CSV files, or other formats
        </p>
        <div className="flex gap-3 justify-center">
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Anki Deck
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <h4 className="font-medium">Import Instructions</h4>
        <div className="grid gap-3 text-sm">
          <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">1</div>
            <div>
              <strong>Anki Files (.apkg):</strong> Export your deck from Anki and upload the .apkg file
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">2</div>
            <div>
              <strong>CSV Format:</strong> Use columns: Front, Back, Extra Notes (optional)
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">3</div>
            <div>
              <strong>Auto-Processing:</strong> Our AI will clean and format your cards automatically
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Flashcard Hub</h1>
          <p className="text-muted-foreground mt-1">Create, study, and share flashcard decks</p>
        </div>
        <Dialog open={createDeckOpen} onOpenChange={setCreateDeckOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Deck
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Deck</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="deck-name">Deck Name</Label>
                <Input
                  id="deck-name"
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  placeholder="Enter deck name..."
                />
              </div>
              <div>
                <Label htmlFor="deck-description">Description</Label>
                <Textarea
                  id="deck-description"
                  value={newDeckDescription}
                  onChange={(e) => setNewDeckDescription(e.target.value)}
                  placeholder="Describe your deck..."
                />
              </div>
              <div>
                <Label htmlFor="deck-subject">Subject</Label>
                <Input
                  id="deck-subject"
                  value={newDeckSubject}
                  onChange={(e) => setNewDeckSubject(e.target.value)}
                  placeholder="e.g., Physics, Programming..."
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setCreateDeckOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreateDeck} className="flex-1">
                  Create Deck
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DeckCategory)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-decks">My Decks</TabsTrigger>
          <TabsTrigger value="shared-decks">Shared Decks</TabsTrigger>
          <TabsTrigger value="import-decks">Import Decks</TabsTrigger>
        </TabsList>

        {activeTab !== "import-decks" && (
          <div className="flex items-center gap-4 mt-6 mb-6 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search decks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>
                    {subject === "all" ? "All Subjects" : subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <TabsContent value="my-decks">
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredDecks(myDecks).map(deck => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
          {filteredDecks(myDecks).length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No decks found</h3>
              <p className="text-muted-foreground">Create your first deck to get started!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="shared-decks">
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredDecks(sharedDecks).map(deck => (
              <DeckCard key={deck.id} deck={deck} showClone />
            ))}
          </div>
          {filteredDecks(sharedDecks).length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No shared decks found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="import-decks">
          <ImportSection />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {shareModalDeck && (
        <ShareModal
          deck={shareModalDeck}
          isOpen={!!shareModalDeck}
          onClose={() => setShareModalDeck(null)}
        />
      )}

      <FlashcardReview
        deck={reviewDeck}
        isOpen={!!reviewDeck}
        onClose={() => setReviewDeck(null)}
        onDeckUpdate={(updatedDeck) => {
          setMyDecks(prev => prev.map(deck => 
            deck.id === updatedDeck.id ? updatedDeck : deck
          ));
        }}
      />
    </div>
  );
}