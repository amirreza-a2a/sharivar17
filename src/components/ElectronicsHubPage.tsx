import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Upload, 
  Download, 
  GitFork, 
  Star, 
  Eye, 
  Zap, 
  Shield, 
  Users, 
  BookOpen, 
  Microchip, 
  Cpu, 
  Database,
  FileText,
  Briefcase,
  GraduationCap,
  Filter,
  ChevronRight,
  Plus
} from "lucide-react";

const ElectronicsHubPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const partCategories = [
    "Microcontrollers", "Power Management", "Analog ICs", "Digital Logic", 
    "Sensors", "Connectors", "Passives", "Memory", "Communication"
  ];

  const featuredParts = [
    { mpn: "STM32F405RGT6", manufacturer: "STMicroelectronics", category: "MCU", lifecycle: "Active", price: "$8.50" },
    { mpn: "LM358", manufacturer: "Texas Instruments", category: "Op-Amp", lifecycle: "Active", price: "$0.35" },
    { mpn: "ESP32-WROOM-32", manufacturer: "Espressif", category: "WiFi Module", lifecycle: "Active", price: "$2.20" }
  ];

  const designProjects = [
    { 
      title: "Buck Converter 12V→3.3V", 
      author: "PowerDesign_Pro", 
      downloads: 1245, 
      stars: 89, 
      license: "CERN-OHL-S",
      tags: ["Power", "SMPS", "Verified"]
    },
    { 
      title: "ESP32 IoT Sensor Node", 
      author: "IoT_Systems", 
      downloads: 2156, 
      stars: 134, 
      license: "MIT",
      tags: ["IoT", "ESP32", "Sensor"]
    },
    { 
      title: "Audio Amplifier TDA2030", 
      author: "AudioGuru", 
      downloads: 876, 
      stars: 56, 
      license: "CC-BY",
      tags: ["Audio", "Amplifier", "Classic"]
    }
  ];

  const standardsChecklist = [
    { standard: "EMC/EMI", compliance: "IEC 61000", status: "Required" },
    { standard: "Safety", compliance: "IEC 60950", status: "Critical" },
    { standard: "RoHS", compliance: "EU 2011/65/EU", status: "Mandatory" },
    { standard: "FCC Part 15", compliance: "US Radio", status: "If wireless" }
  ];

  const researchKits = [
    {
      title: "5G mmWave Antenna Arrays",
      description: "Complete dataset and PCB designs for 28GHz antenna research",
      tags: ["5G", "RF", "Antenna", "mmWave"],
      citations: 23,
      downloads: 156
    },
    {
      title: "Low-Power IoT Protocol Stack",
      description: "Energy-optimized communication protocols for battery-powered devices",
      tags: ["IoT", "Low-Power", "Protocol", "Battery"],
      citations: 41,
      downloads: 289
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Electronics Professionals Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your complete toolkit for electronics design - from component selection to validated PCB designs, 
            with AI-powered insights and industry connections.
          </p>
        </div>

        {/* Global Search */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search parts, designs, standards, research..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                AI Co-pilot
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Navigation Tabs */}
        <Tabs defaultValue="parts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-muted/50">
            <TabsTrigger value="parts" className="flex items-center gap-2">
              <Microchip className="h-4 w-4" />
              Parts
            </TabsTrigger>
            <TabsTrigger value="designs" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Designs
            </TabsTrigger>
            <TabsTrigger value="blocks" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Blocks
            </TabsTrigger>
            <TabsTrigger value="standards" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Standards
            </TabsTrigger>
            <TabsTrigger value="industry" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Industry
            </TabsTrigger>
            <TabsTrigger value="research" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Research
            </TabsTrigger>
          </TabsList>

          {/* Parts & Datasheets */}
          <TabsContent value="parts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {partCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Lifecycle</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="nrnd">NRND</SelectItem>
                          <SelectItem value="eol">EOL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Parts</CardTitle>
                    <CardDescription>Popular components in the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {featuredParts.map((part, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                          <div className="space-y-1">
                            <h4 className="font-semibold">{part.mpn}</h4>
                            <p className="text-sm text-muted-foreground">{part.manufacturer}</p>
                            <div className="flex gap-2">
                              <Badge variant="secondary">{part.category}</Badge>
                              <Badge variant="outline">{part.lifecycle}</Badge>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <p className="font-semibold">{part.price}</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">Datasheet</Button>
                              <Button size="sm">Add to BOM</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Designs & Simulations */}
          <TabsContent value="designs" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Design Library</h3>
                <p className="text-muted-foreground">Share, view, and fork electronics designs</p>
              </div>
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Design
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {designProjects.map((project, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>by {project.author}</CardDescription>
                      </div>
                      <Badge variant="outline">{project.license}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {project.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {project.stars}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="flex-1">
                        <GitFork className="h-4 w-4 mr-1" />
                        Fork
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Blocks Library */}
          <TabsContent value="blocks" className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Reusable Circuit Blocks</h3>
              <p className="text-muted-foreground">Proven schematic and PCB blocks for faster design</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["Power Supplies", "Motor Drivers", "Sensor Interfaces", "Communication", "Protection Circuits", "Test Points"].map((block) => (
                <Card key={block} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {block}
                      <ChevronRight className="h-5 w-5" />
                    </CardTitle>
                    <CardDescription>Ready-to-use {block.toLowerCase()} circuits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">12 blocks available</span>
                      <Button size="sm" variant="outline">Browse</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Standards Desk */}
          <TabsContent value="standards" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold">Compliance Standards</h3>
              <p className="text-muted-foreground">Stay compliant with industry standards and regulations</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Standards Checklist</CardTitle>
                <CardDescription>Essential compliance requirements for electronics design</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {standardsChecklist.map((std, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{std.standard}</h4>
                        <p className="text-sm text-muted-foreground">{std.compliance}</p>
                      </div>
                      <Badge variant={std.status === "Critical" ? "destructive" : std.status === "Required" ? "default" : "secondary"}>
                        {std.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Industry ↔ Academia */}
          <TabsContent value="industry" className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Industry ↔ Academia Bridge</h3>
              <p className="text-muted-foreground">Connect research with real-world applications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Industry Challenges
                  </CardTitle>
                  <CardDescription>Real problems seeking research solutions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Low-Power 5G Modem Design</h4>
                    <p className="text-sm text-muted-foreground mt-1">Seeking breakthrough in power efficiency for mobile devices</p>
                    <div className="flex gap-2 mt-2">
                      <Badge>5G</Badge>
                      <Badge>Power</Badge>
                      <Badge>RF</Badge>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Challenge
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Research Solutions
                  </CardTitle>
                  <CardDescription>Academic innovations ready for industry</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Neuromorphic Computing Chips</h4>
                    <p className="text-sm text-muted-foreground mt-1">Brain-inspired computing for ultra-low power AI</p>
                    <div className="flex gap-2 mt-2">
                      <Badge>AI</Badge>
                      <Badge>Neuromorphic</Badge>
                      <Badge>Low-Power</Badge>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Research
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Research Kits */}
          <TabsContent value="research" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold">Research Kits</h3>
              <p className="text-muted-foreground">Thesis-grade starter kits with datasets, circuits, and simulations</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {researchKits.map((kit, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{kit.title}</CardTitle>
                    <CardDescription>{kit.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {kit.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{kit.citations} citations</span>
                      <span className="text-muted-foreground">{kit.downloads} downloads</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download Kit
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Paper
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* AI Co-pilot Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              AI Co-pilot
            </CardTitle>
            <CardDescription>Your intelligent electronics design assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input 
                placeholder="Ask me: 'Find a 5V low-noise op-amp under $1' or 'Compare STM32 vs ESP32 for IoT'"
                className="flex-1"
              />
              <Button>Ask AI</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ElectronicsHubPage;