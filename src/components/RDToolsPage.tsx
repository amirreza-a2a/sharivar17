import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  TrendingUp, 
  Wrench, 
  GitCompare, 
  Brain, 
  Star, 
  ExternalLink, 
  Cpu, 
  Zap, 
  Radio, 
  Atom,
  Filter
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  popularity: "Hot" | "Rising" | "Stable";
  tags: string[];
  link: string;
  useCase: string;
}

const mockTools: Tool[] = [
  {
    id: "1",
    name: "STM32CubeIDE",
    category: "Embedded Systems",
    description: "Integrated development environment for STM32 microcontrollers",
    rating: 4.5,
    popularity: "Hot",
    tags: ["IDE", "STM32", "Debugging"],
    link: "https://www.st.com/en/development-tools/stm32cubeide.html",
    useCase: "Microcontroller development and debugging"
  },
  {
    id: "2",
    name: "PyTorch",
    category: "Artificial Intelligence",
    description: "Open-source machine learning framework for Python",
    rating: 4.8,
    popularity: "Hot",
    tags: ["ML", "Deep Learning", "Python"],
    link: "https://pytorch.org",
    useCase: "Neural network training and deployment"
  },
  {
    id: "3",
    name: "Qiskit",
    category: "Quantum Computing",
    description: "Open-source SDK for working with quantum computers",
    rating: 4.3,
    popularity: "Rising",
    tags: ["Quantum", "IBM", "SDK"],
    link: "https://qiskit.org",
    useCase: "Quantum algorithm development and simulation"
  },
  {
    id: "4",
    name: "GNU Radio",
    category: "Telecommunication",
    description: "Software development toolkit for signal processing applications",
    rating: 4.2,
    popularity: "Stable",
    tags: ["SDR", "Signal Processing", "RF"],
    link: "https://www.gnuradio.org",
    useCase: "Software-defined radio applications"
  },
  {
    id: "5",
    name: "PlatformIO",
    category: "Embedded Systems",
    description: "Professional collaborative platform for embedded development",
    rating: 4.6,
    popularity: "Rising",
    tags: ["IDE", "Multi-platform", "IoT"],
    link: "https://platformio.org",
    useCase: "Cross-platform embedded development"
  },
  {
    id: "6",
    name: "Hugging Face",
    category: "Artificial Intelligence",
    description: "Platform for machine learning models and datasets",
    rating: 4.7,
    popularity: "Hot",
    tags: ["NLP", "Models", "Transformers"],
    link: "https://huggingface.co",
    useCase: "Pre-trained model deployment and fine-tuning"
  }
];

const categories = [
  { id: "all", name: "All Categories", icon: Filter },
  { id: "embedded", name: "Embedded Systems", icon: Cpu },
  { id: "ai", name: "Artificial Intelligence", icon: Brain },
  { id: "quantum", name: "Quantum Computing", icon: Atom },
  { id: "telecom", name: "Telecommunication", icon: Radio }
];

const innovations = [
  {
    title: "New RISC-V Development Board Released",
    summary: "AI-powered analysis of the latest RISC-V board features and capabilities",
    category: "Embedded Systems",
    date: "2 hours ago"
  },
  {
    title: "GPT-5 Integration Tools for Developers",
    summary: "Latest SDKs and frameworks for integrating GPT-5 into applications",
    category: "Artificial Intelligence", 
    date: "4 hours ago"
  },
  {
    title: "Quantum Error Correction Breakthrough",
    summary: "New quantum computing tools emerging from recent research advances",
    category: "Quantum Computing",
    date: "1 day ago"
  }
];

export function RDToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [comparisonTools, setComparisonTools] = useState<Tool[]>([]);

  const filteredTools = mockTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || 
                           tool.category.toLowerCase().includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const addToComparison = (tool: Tool) => {
    if (comparisonTools.length < 3 && !comparisonTools.find(t => t.id === tool.id)) {
      setComparisonTools([...comparisonTools, tool]);
    }
  };

  const removeFromComparison = (toolId: string) => {
    setComparisonTools(comparisonTools.filter(t => t.id !== toolId));
  };

  const PopularityBadge = ({ popularity }: { popularity: Tool["popularity"] }) => {
    const colors = {
      Hot: "bg-red-500/10 text-red-600 border-red-200",
      Rising: "bg-orange-500/10 text-orange-600 border-orange-200", 
      Stable: "bg-green-500/10 text-green-600 border-green-200"
    };
    
    return (
      <Badge variant="outline" className={colors[popularity]}>
        {popularity}
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">R&D Tools Hub</h1>
        <p className="text-muted-foreground">
          Discover the latest tools, frameworks, and methodologies for innovation
        </p>
      </div>

      <Tabs defaultValue="explorer" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Innovation Feed
          </TabsTrigger>
          <TabsTrigger value="explorer" className="gap-2">
            <Wrench className="w-4 h-4" />
            Tool Explorer
          </TabsTrigger>
          <TabsTrigger value="compare" className="gap-2">
            <GitCompare className="w-4 h-4" />
            Compare Tools
          </TabsTrigger>
          <TabsTrigger value="advisor" className="gap-2">
            <Brain className="w-4 h-4" />
            AI Advisor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Hot in R&D This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {innovations.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{item.title}</h3>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.summary}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explorer" className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search tools, frameworks, libraries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <Card key={tool.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <PopularityBadge popularity={tool.popularity} />
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    {tool.category}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                  <p className="text-sm font-medium">Use Case: {tool.useCase}</p>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(tool.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        {tool.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {tool.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={tool.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visit
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToComparison(tool)}
                      disabled={comparisonTools.length >= 3 || comparisonTools.some(t => t.id === tool.id)}
                    >
                      <GitCompare className="w-3 h-3 mr-1" />
                      Compare
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compare" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tool Comparison Engine</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add up to 3 tools to compare side by side
              </p>
            </CardHeader>
            <CardContent>
              {comparisonTools.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tools selected for comparison. Go to Tool Explorer to add tools.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    {comparisonTools.map((tool) => (
                      <Badge key={tool.id} variant="secondary" className="gap-2">
                        {tool.name}
                        <button
                          onClick={() => removeFromComparison(tool.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${comparisonTools.length}, 1fr)` }}>
                    {comparisonTools.map((tool) => (
                      <Card key={tool.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          <Badge variant="secondary">{tool.category}</Badge>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-sm">Description</h4>
                            <p className="text-sm text-muted-foreground">{tool.description}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">Rating</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(tool.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-sm ml-1">{tool.rating}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">Use Case</h4>
                            <p className="text-sm text-muted-foreground">{tool.useCase}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">Tags</h4>
                            <div className="flex flex-wrap gap-1">
                              {tool.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advisor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Tool Advisor
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Ask about the best tools for your specific needs
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-semibold mb-2">Example Questions:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• "What's the best simulation software for embedded hardware testing?"</li>
                    <li>• "Which ML framework should I use for computer vision projects?"</li>
                    <li>• "Compare STM32 vs ESP32 development ecosystems"</li>
                    <li>• "What tools do I need for quantum algorithm development?"</li>
                  </ul>
                </div>
                
                <div className="flex gap-2">
                  <Input placeholder="Ask me about tools and frameworks..." />
                  <Button>
                    <Brain className="w-4 h-4 mr-2" />
                    Ask AI
                  </Button>
                </div>
                
                <div className="text-center text-muted-foreground py-8">
                  <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>AI Advisor coming soon! This will provide personalized tool recommendations.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}