import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FileText, 
  Code, 
  ExternalLink, 
  Download,
  Eye,
  Folder,
  File
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'code' | 'link' | 'document';
  size?: string;
  category: string;
  url?: string;
  description?: string;
}

interface LessonResourcesProps {
  lessonTitle: string;
}

// Mock data - in a real app, this would come from props or API
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'STM32 GPIO Reference',
    type: 'pdf',
    size: '2.3 MB',
    category: 'Documentation',
    description: 'Complete GPIO peripheral documentation'
  },
  {
    id: '2',
    title: 'GPIO Configuration Examples',
    type: 'code',
    size: '156 KB',
    category: 'Code Examples',
    description: 'Sample configurations for common GPIO operations'
  },
  {
    id: '3',
    title: 'STM32CubeIDE Documentation',
    type: 'link',
    category: 'External Resources',
    url: 'https://www.st.com/en/development-tools/stm32cubeide.html',
    description: 'Official STM32 development environment'
  },
  {
    id: '4',
    title: 'Pin Configuration Guide',
    type: 'document',
    size: '892 KB',
    category: 'Guides',
    description: 'Step-by-step pin setup instructions'
  },
  {
    id: '5',
    title: 'LED Blinking Project',
    type: 'code',
    size: '45 KB',
    category: 'Projects',
    description: 'Complete project files for LED control'
  },
  {
    id: '6',
    title: 'Hardware Abstraction Layer',
    type: 'pdf',
    size: '1.8 MB',
    category: 'Documentation',
    description: 'HAL library reference and usage'
  }
];

const getResourceIcon = (type: Resource['type']) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-4 w-4" />;
    case 'code':
      return <Code className="h-4 w-4" />;
    case 'link':
      return <ExternalLink className="h-4 w-4" />;
    case 'document':
      return <File className="h-4 w-4" />;
    default:
      return <File className="h-4 w-4" />;
  }
};

const getResourceColor = (type: Resource['type']) => {
  switch (type) {
    case 'pdf':
      return 'text-red-500';
    case 'code':
      return 'text-green-500';
    case 'link':
      return 'text-blue-500';
    case 'document':
      return 'text-purple-500';
    default:
      return 'text-muted-foreground';
  }
};

export function LessonResources({ lessonTitle }: LessonResourcesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(mockResources.map(r => r.category)));
  
  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleResourceAction = (resource: Resource) => {
    if (resource.type === 'link' && resource.url) {
      window.open(resource.url, '_blank');
    } else {
      // Handle download or view action
      console.log('Opening resource:', resource.title);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background border-l">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <Folder className="h-5 w-5 text-primary" />
          Resources
        </h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="h-7 text-xs"
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="h-7 text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Resources List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="group p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
              onClick={() => handleResourceAction(resource)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={cn("mt-1 flex-shrink-0", getResourceColor(resource.type))}>
                    {getResourceIcon(resource.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                      {resource.title}
                    </h4>
                    {resource.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {resource.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs h-5">
                        {resource.category}
                      </Badge>
                      {resource.size && (
                        <span className="text-xs text-muted-foreground">
                          {resource.size}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 flex-shrink-0"
                >
                  {resource.type === 'link' ? (
                    <ExternalLink className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
          
          {filteredResources.length === 0 && (
            <div className="text-center py-8">
              <div className="text-muted-foreground text-sm">
                No resources found matching your search.
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}