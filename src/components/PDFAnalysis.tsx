import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Brain, 
  MessageSquare, 
  Download, 
  Loader2,
  BookOpen,
  CreditCard
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShareModal } from "@/components/FlashcardModal";
import { saveDeck } from "@/utils/flashcardStorage";
import { Flashcard } from "@/types/flashcard";

interface PDFAnalysisProps {
  extractedText: string;
  fileName: string;
}

interface AnalysisResult {
  type: 'summarize' | 'explain' | 'question';
  content: string;
  timestamp: Date;
}

export const PDFAnalysis = ({ extractedText, fileName }: PDFAnalysisProps) => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [extractedFlashcards, setExtractedFlashcards] = useState<Flashcard[]>([]);
  const { toast } = useToast();

  const performAnalysis = async (action: 'summarize' | 'explain' | 'question') => {
    if (!extractedText) {
      toast({
        title: "No content to analyze",
        description: "Please upload a PDF first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('pdf-analysis', {
        body: {
          text: extractedText,
          action,
          question: action === 'question' ? question : undefined
        }
      });

      if (error) throw error;

      const result: AnalysisResult = {
        type: action,
        content: data.analysis,
        timestamp: new Date()
      };

      setAnalysisResults(prev => [result, ...prev]);
      
      if (action === 'question') {
        setQuestion('');
      }

      toast({
        title: "Analysis complete",
        description: "Your request has been processed successfully",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportAnalysis = () => {
    const content = analysisResults
      .map(result => {
        const type = result.type.charAt(0).toUpperCase() + result.type.slice(1);
        return `## ${type} - ${result.timestamp.toLocaleString()}\n\n${result.content}\n\n---\n\n`;
      })
      .join('');
    
    const blob = new Blob([`# Analysis of ${fileName}\n\n${content}`], { 
      type: 'text/markdown' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace('.pdf', '')}-analysis.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const extractFlashcards = () => {
    if (!extractedText) {
      toast({
        title: "No content to extract",
        description: "Please upload a PDF first",
        variant: "destructive",
      });
      return;
    }

    // Mock flashcard extraction for now
    const mockCards: Flashcard[] = [
      {
        id: crypto.randomUUID(),
        front: "Sample question from PDF",
        back: "Sample answer extracted from content",
        level: 1,
        nextReviewDate: new Date().toISOString(),
        timesReviewed: 0,
        timesLapsed: 0
      }
    ];
    setExtractedFlashcards(mockCards);
    setShowFlashcardModal(true);
  };

  const handleSaveFlashcards = (cards: Flashcard[], title: string) => {
    const newDeck = {
      id: crypto.randomUUID(),
      name: title || `${fileName.replace('.pdf', '')} Flashcards`,
      description: `Flashcards extracted from ${fileName}`,
      subject: "General",
      tags: ["pdf", "extracted"],
      cards,
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
    toast({
      title: "Flashcard deck created!",
      description: `Created "${newDeck.name}" with ${cards.length} cards`,
    });

    setShowFlashcardModal(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'summarize': return <FileText className="h-4 w-4" />;
      case 'explain': return <BookOpen className="h-4 w-4" />;
      case 'question': return <MessageSquare className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Analysis
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => performAnalysis('summarize')}
            disabled={isLoading}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Summarize
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => performAnalysis('explain')}
            disabled={isLoading}
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Explain
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={extractFlashcards}
            disabled={isLoading}
            className="gap-2 border-[#2979FF] text-[#2979FF] hover:bg-[#2979FF] hover:text-white"
          >
            🃏 Extract Flashcards
          </Button>
          {analysisResults.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportAnalysis}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask a question about the document..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={() => performAnalysis('question')}
            disabled={isLoading || !question.trim()}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
            Ask
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {analysisResults.length === 0 ? (
              <div className="text-center text-muted-foreground p-8">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No analysis yet. Click the buttons above to get started!</p>
              </div>
            ) : (
              analysisResults.map((result, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getIcon(result.type)}
                    <span className="capitalize">{result.type}</span>
                    <span>•</span>
                    <span>{result.timestamp.toLocaleString()}</span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="bg-muted/50 rounded-lg p-4">
                      {result.content.split('\n').map((line, lineIndex) => (
                        <p key={lineIndex} className="mb-2 last:mb-0">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                  {index < analysisResults.length - 1 && <Separator />}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      {/* Flashcard modal temporarily removed - will be re-implemented */}
    </Card>
  );
};