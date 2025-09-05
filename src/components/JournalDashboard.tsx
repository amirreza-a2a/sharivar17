import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen,
  Calendar,
  Flame,
  Target,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  SortAsc,
  RotateCcw,
  Highlighter,
  TrendingUp,
  Clock
} from "lucide-react";
import { JournalEntry, JournalStats } from "@/types/journal";
import { getJournalEntries, getJournalStats } from "@/utils/journalStorage";
import { JournalEntryCard } from "./JournalEntryCard";
import { cn } from "@/lib/utils";

interface JournalDashboardProps {
  onReviewMistakes?: (entries: JournalEntry[]) => void;
  onReviewHighlights?: (entries: JournalEntry[]) => void;
}

export function JournalDashboard({ onReviewMistakes, onReviewHighlights }: JournalDashboardProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState<JournalStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'mistakes' | 'highlights'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'module'>('date');

  useEffect(() => {
    loadJournalData();
  }, []);

  const loadJournalData = () => {
    const journalEntries = getJournalEntries();
    const journalStats = getJournalStats();
    
    // Sort entries by completion date (newest first)
    const sortedEntries = journalEntries.sort((a, b) => 
      new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime()
    );
    
    setEntries(sortedEntries);
    setStats(journalStats);
  };

  const filteredAndSortedEntries = entries
    .filter(entry => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          entry.lessonTitle.toLowerCase().includes(searchLower) ||
          entry.moduleTitle.toLowerCase().includes(searchLower) ||
          entry.userNotes.toLowerCase().includes(searchLower) ||
          entry.keyTakeaway?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(entry => {
      // Category filter
      switch (filterBy) {
        case 'recent':
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return new Date(entry.completionDate) > oneWeekAgo;
        case 'mistakes':
          return entry.mistakes.length > 0;
        case 'highlights':
          return entry.highlights.length > 0;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      // Sort entries
      switch (sortBy) {
        case 'title':
          return a.lessonTitle.localeCompare(b.lessonTitle);
        case 'module':
          return a.moduleTitle.localeCompare(b.moduleTitle);
        case 'date':
        default:
          return new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime();
      }
    });

  const handleReviewAllMistakes = () => {
    const entriesWithMistakes = entries.filter(entry => entry.mistakes.length > 0);
    onReviewMistakes?.(entriesWithMistakes);
  };

  const handleReviewAllHighlights = () => {
    const entriesWithHighlights = entries.filter(entry => entry.highlights.length > 0);
    onReviewHighlights?.(entriesWithHighlights);
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your learning journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="gradient-primary text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white/20">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Study Streak</p>
                <p className="text-2xl font-bold">{stats.currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-success text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white/20">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Lessons Completed</p>
                <p className="text-2xl font-bold">{stats.lessonsCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-warning text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white/20">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Challenges Fixed</p>
                <p className="text-2xl font-bold">{stats.mistakesFixed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-info text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Time Studied</p>
                <p className="text-2xl font-bold">{Math.round(stats.totalTimeSpent / 60)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Quick Review</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleReviewAllMistakes}
              className="gap-2"
              disabled={!entries.some(e => e.mistakes.length > 0)}
            >
              <RotateCcw className="w-4 h-4" />
              Review All Mistakes
            </Button>
            <Button
              variant="outline"
              onClick={handleReviewAllHighlights}
              className="gap-2"
              disabled={!entries.some(e => e.highlights.length > 0)}
            >
              <Highlighter className="w-4 h-4" />
              Review All Highlights
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search lessons, notes, or takeaways..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="flex border rounded-lg overflow-hidden">
                {[
                  { key: 'all', label: 'All', icon: BookOpen },
                  { key: 'recent', label: 'Recent', icon: Calendar },
                  { key: 'mistakes', label: 'Mistakes', icon: AlertTriangle },
                  { key: 'highlights', label: 'Highlights', icon: Highlighter },
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={filterBy === key ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilterBy(key as any)}
                    className={cn(
                      "rounded-none gap-1",
                      filterBy === key && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal Entries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Your Learning Journey ({filteredAndSortedEntries.length} entries)
          </h2>
        </div>

        {filteredAndSortedEntries.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No journal entries found</h3>
              <p className="text-muted-foreground mb-6">
                {entries.length === 0
                  ? "Complete your first lesson to start building your learning journal!"
                  : "Try adjusting your search or filter settings."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredAndSortedEntries.map((entry) => (
                <JournalEntryCard
                  key={entry.id}
                  entry={entry}
                  onUpdate={loadJournalData}
                  onReviewMistakes={(entry) => onReviewMistakes?.([entry])}
                  onReviewHighlights={(entry) => onReviewHighlights?.([entry])}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}