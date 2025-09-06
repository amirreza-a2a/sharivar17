import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  BookOpen, 
  Plus, 
  Eye,
  Clock,
  TrendingUp,
  Award,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

interface PathDiscoveryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPath: (pathId: string) => void;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  creator: string;
  followers: number;
  rating: number;
  steps: number;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  category: string;
  isPopular?: boolean;
  isNew?: boolean;
  added?: boolean;
}

const MOCK_PATHS: LearningPath[] = [
  {
    id: "complete-devops",
    title: "Complete DevOps Roadmap",
    description: "Master DevOps from containerization to CI/CD pipelines and cloud deployment",
    creator: "John Doe",
    followers: 1200,
    rating: 4.8,
    steps: 15,
    estimatedTime: "8 weeks",
    difficulty: "Advanced",
    tags: ["Docker", "Kubernetes", "CI/CD", "AWS"],
    category: "DevOps",
    isPopular: true
  },
  {
    id: "react-mastery",
    title: "React Mastery Path",
    description: "From React basics to advanced patterns, hooks, and state management",
    creator: "Sarah Chen",
    followers: 890,
    rating: 4.9,
    steps: 12,
    estimatedTime: "6 weeks",
    difficulty: "Intermediate",
    tags: ["React", "JavaScript", "Redux", "Hooks"],
    category: "Web Development",
    isNew: true
  },
  {
    id: "ai-ml-foundations",
    title: "AI & Machine Learning Foundations",
    description: "Essential concepts in AI/ML with hands-on Python implementation",
    creator: "Dr. Alex Kumar",
    followers: 2100,
    rating: 4.7,
    steps: 20,
    estimatedTime: "10 weeks",
    difficulty: "Beginner",
    tags: ["Python", "TensorFlow", "Neural Networks", "Data Science"],
    category: "AI/ML"
  },
  {
    id: "cybersecurity-essentials",
    title: "Cybersecurity Essentials",
    description: "Core security principles, threat analysis, and penetration testing",
    creator: "Mike Rodriguez",
    followers: 756,
    rating: 4.6,
    steps: 14,
    estimatedTime: "7 weeks",
    difficulty: "Intermediate",
    tags: ["Security", "Ethical Hacking", "Network Security"],
    category: "Security",
    isPopular: true
  },
  {
    id: "mobile-dev-flutter",
    title: "Cross-Platform Mobile with Flutter",
    description: "Build beautiful apps for iOS and Android using Flutter and Dart",
    creator: "Emma Johnson",
    followers: 634,
    rating: 4.5,
    steps: 16,
    estimatedTime: "9 weeks",
    difficulty: "Intermediate",
    tags: ["Flutter", "Dart", "Mobile", "Cross-Platform"],
    category: "Mobile Development"
  },
  {
    id: "blockchain-development",
    title: "Blockchain Development Fundamentals",
    description: "Smart contracts, DApps, and Web3 development from scratch",
    creator: "David Park",
    followers: 445,
    rating: 4.4,
    steps: 18,
    estimatedTime: "12 weeks",
    difficulty: "Advanced",
    tags: ["Blockchain", "Solidity", "Web3", "Smart Contracts"],
    category: "Blockchain",
    isNew: true
  }
];

const CATEGORIES = ["All", "Web Development", "DevOps", "AI/ML", "Security", "Mobile Development", "Blockchain"];
const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "new", label: "Newest" },
  { value: "followers", label: "Most Followed" }
];

export default function PathDiscoveryModal({ open, onOpenChange, onAddPath }: PathDiscoveryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [previewPath, setPreviewPath] = useState<LearningPath | null>(null);
  const [addedPaths, setAddedPaths] = useState<Set<string>>(new Set());

  const handleAddPath = (pathId: string) => {
    setAddedPaths(prev => new Set([...prev, pathId]));
    onAddPath(pathId);
    toast.success("Path successfully added to your dashboard!");
  };

  const filteredPaths = MOCK_PATHS.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || path.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "followers":
        return b.followers - a.followers;
      case "new":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default:
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.followers - a.followers;
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (previewPath) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setPreviewPath(null)}
                className="p-1"
              >
                ← Back
              </Button>
              <DialogTitle>{previewPath.title}</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {previewPath.followers} followers
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {previewPath.rating}/5
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {previewPath.estimatedTime}
              </div>
              <Badge className={getDifficultyColor(previewPath.difficulty)}>
                {previewPath.difficulty}
              </Badge>
            </div>

            <p className="text-muted-foreground">{previewPath.description}</p>

            <div className="flex flex-wrap gap-2">
              {previewPath.tags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>

            <div>
              <h4 className="font-semibold mb-3">Learning Steps ({previewPath.steps} total)</h4>
              <div className="space-y-2">
                {Array.from({ length: Math.min(previewPath.steps, 8) }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                      {index + 1}
                    </div>
                    <span>Step {index + 1}: {getStepTitle(previewPath.category, index)}</span>
                  </div>
                ))}
                {previewPath.steps > 8 && (
                  <div className="text-center text-sm text-muted-foreground">
                    ... and {previewPath.steps - 8} more steps
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => handleAddPath(previewPath.id)}
                disabled={addedPaths.has(previewPath.id)}
                className="flex-1"
              >
                {addedPaths.has(previewPath.id) ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Added
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to My Paths
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Explore Learning Paths</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search paths by topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {CATEGORIES.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
              
              <div className="ml-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border rounded-md px-3 py-1 bg-background"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Learning Paths Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPaths.map(path => (
              <Card 
                key={path.id} 
                className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
                onClick={() => setPreviewPath(path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base leading-tight flex items-center gap-2">
                        {path.title}
                        {path.isPopular && <TrendingUp className="w-4 h-4 text-orange-500" />}
                        {path.isNew && <Award className="w-4 h-4 text-blue-500" />}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        by {path.creator}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {path.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {path.followers}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {path.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {path.steps} steps
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {path.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                        {tag}
                      </Badge>
                    ))}
                    {path.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        +{path.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewPath(path);
                      }}
                      className="flex-1 text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddPath(path.id);
                      }}
                      disabled={addedPaths.has(path.id)}
                      className="flex-1 text-xs"
                    >
                      {addedPaths.has(path.id) ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredPaths.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No paths found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getStepTitle(category: string, index: number): string {
  const stepTitles: Record<string, string[]> = {
    "DevOps": [
      "Introduction to DevOps Culture",
      "Version Control with Git",
      "Containerization with Docker",
      "Container Orchestration",
      "CI/CD Pipeline Setup",
      "Infrastructure as Code",
      "Monitoring & Logging",
      "Security Best Practices"
    ],
    "Web Development": [
      "JavaScript Fundamentals",
      "React Component Basics",
      "State Management",
      "Routing & Navigation",
      "API Integration",
      "Testing Strategies",
      "Performance Optimization",
      "Deployment Strategies"
    ],
    "AI/ML": [
      "Introduction to AI/ML",
      "Python for Data Science",
      "Data Preprocessing",
      "Supervised Learning",
      "Unsupervised Learning", 
      "Neural Networks",
      "Deep Learning",
      "Model Deployment"
    ]
  };
  
  const titles = stepTitles[category] || [
    "Foundation Concepts",
    "Core Principles", 
    "Practical Implementation",
    "Advanced Techniques",
    "Best Practices",
    "Real-world Projects",
    "Performance Optimization",
    "Professional Development"
  ];
  
  return titles[index] || `Advanced Topic ${index + 1}`;
}