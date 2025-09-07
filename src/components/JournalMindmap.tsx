import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Eye,
  EyeOff
} from "lucide-react";
import { JournalEntry } from "@/types/journal";
import { toast } from "sonner";

interface MindmapNode {
  id: string;
  label: string;
  type: 'lesson' | 'keypoint' | 'mistake' | 'highlight';
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  entryId?: string;
  size: number;
}

interface MindmapLink {
  source: string;
  target: string;
  strength: number;
}

interface JournalMindmapProps {
  entries: JournalEntry[];
  onNodeClick?: (node: MindmapNode) => void;
}

export const JournalMindmap = ({ entries, onNodeClick }: JournalMindmapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<MindmapNode[]>([]);
  const [links, setLinks] = useState<MindmapLink[]>([]);
  const [showNodeTypes, setShowNodeTypes] = useState({
    lesson: true,
    keypoint: true,
    mistake: true,
    highlight: true
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMindmapData = () => {
    setIsGenerating(true);
    
    const newNodes: MindmapNode[] = [];
    const newLinks: MindmapLink[] = [];
    
    // Create lesson nodes
    entries.forEach((entry) => {
      newNodes.push({
        id: `lesson-${entry.id}`,
        label: entry.lessonTitle,
        type: 'lesson',
        entryId: entry.id,
        size: 20
      });

      // Create key point nodes
      entry.keyPoints.forEach((point, index) => {
        const keypointId = `keypoint-${entry.id}-${index}`;
        newNodes.push({
          id: keypointId,
          label: point.length > 30 ? point.substring(0, 30) + '...' : point,
          type: 'keypoint',
          entryId: entry.id,
          size: 12
        });
        
        newLinks.push({
          source: `lesson-${entry.id}`,
          target: keypointId,
          strength: 0.8
        });
      });

      // Create mistake nodes
      entry.mistakes.forEach((mistake, index) => {
        const mistakeId = `mistake-${entry.id}-${index}`;
        newNodes.push({
          id: mistakeId,
          label: mistake.description.length > 25 ? mistake.description.substring(0, 25) + '...' : mistake.description,
          type: 'mistake',
          entryId: entry.id,
          size: 10
        });
        
        newLinks.push({
          source: `lesson-${entry.id}`,
          target: mistakeId,
          strength: 0.6
        });
      });

      // Create highlight nodes
      entry.highlights.forEach((highlight, index) => {
        const highlightId = `highlight-${entry.id}-${index}`;
        newNodes.push({
          id: highlightId,
          label: highlight.text.length > 20 ? highlight.text.substring(0, 20) + '...' : highlight.text,
          type: 'highlight',
          entryId: entry.id,
          size: 8
        });
        
        newLinks.push({
          source: `lesson-${entry.id}`,
          target: highlightId,
          strength: 0.5
        });
      });
    });

    // Create cross-lesson connections based on similar keywords
    const keywordMap = new Map<string, string[]>();
    entries.forEach((entry) => {
      const keywords = entry.keyPoints.flatMap(point => 
        point.toLowerCase().split(' ').filter(word => word.length > 4)
      );
      keywords.forEach(keyword => {
        if (!keywordMap.has(keyword)) {
          keywordMap.set(keyword, []);
        }
        keywordMap.get(keyword)!.push(`lesson-${entry.id}`);
      });
    });

    keywordMap.forEach((lessonIds) => {
      if (lessonIds.length > 1) {
        for (let i = 0; i < lessonIds.length - 1; i++) {
          newLinks.push({
            source: lessonIds[i],
            target: lessonIds[i + 1],
            strength: 0.3
          });
        }
      }
    });

    setNodes(newNodes);
    setLinks(newLinks);
    setIsGenerating(false);
    toast.success("Mindmap generated from your journal entries!");
  };

  const renderMindmap = () => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    
    svg.attr("width", width).attr("height", height);

    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Filter nodes based on visibility settings
    const visibleNodes = nodes.filter(node => showNodeTypes[node.type]);
    const visibleLinks = links.filter(link => 
      visibleNodes.some(n => n.id === link.source) && 
      visibleNodes.some(n => n.id === link.target)
    );

    // Create force simulation
    const simulation = d3.forceSimulation(visibleNodes as any)
      .force("link", d3.forceLink(visibleLinks).id((d: any) => d.id).strength(d => (d as any).strength))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => (d as any).size + 5));

    // Create links
    const link = g.append("g")
      .selectAll("line")
      .data(visibleLinks)
      .enter().append("line")
      .attr("stroke", "hsl(var(--border))")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.strength * 5));

    // Create nodes
    const node = g.append("g")
      .selectAll("g")
      .data(visibleNodes)
      .enter().append("g")
      .attr("cursor", "pointer")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Add circles for nodes
    node.append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => {
        switch (d.type) {
          case 'lesson': return "hsl(var(--primary))";
          case 'keypoint': return "hsl(var(--success))";
          case 'mistake': return "hsl(var(--warning))";
          case 'highlight': return "hsl(var(--info))";
          default: return "hsl(var(--muted))";
        }
      })
      .attr("stroke", "hsl(var(--background))")
      .attr("stroke-width", 2);

    // Add labels
    node.append("text")
      .text(d => d.label)
      .attr("x", 0)
      .attr("y", d => d.size + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "hsl(var(--foreground))")
      .attr("font-size", d => d.type === 'lesson' ? "12px" : "10px")
      .attr("font-weight", d => d.type === 'lesson' ? "bold" : "normal");

    // Add click handler
    node.on("click", (event, d) => {
      if (onNodeClick) {
        onNodeClick(d);
      }
    });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });
  };

  useEffect(() => {
    if (entries.length > 0 && nodes.length === 0) {
      generateMindmapData();
    }
  }, [entries]);

  useEffect(() => {
    renderMindmap();
  }, [nodes, links, showNodeTypes]);

  const toggleNodeType = (type: keyof typeof showNodeTypes) => {
    setShowNodeTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const zoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      (d3.zoom<SVGSVGElement, unknown>().scaleBy as any), 1.2
    );
  };

  const zoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      (d3.zoom<SVGSVGElement, unknown>().scaleBy as any), 0.8
    );
  };

  const resetZoom = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      (d3.zoom<SVGSVGElement, unknown>().transform as any),
      d3.zoomIdentity
    );
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No Journal Entries Yet</h3>
            <p className="text-muted-foreground">
              Complete some lessons to generate your knowledge mindmap.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Knowledge Mindmap</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={generateMindmapData}
                disabled={isGenerating}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetZoom}>
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={showNodeTypes.lesson ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleNodeType('lesson')}
            >
              {showNodeTypes.lesson ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
              Lessons ({nodes.filter(n => n.type === 'lesson').length})
            </Badge>
            <Badge 
              variant={showNodeTypes.keypoint ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleNodeType('keypoint')}
            >
              {showNodeTypes.keypoint ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
              Key Points ({nodes.filter(n => n.type === 'keypoint').length})
            </Badge>
            <Badge 
              variant={showNodeTypes.mistake ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleNodeType('mistake')}
            >
              {showNodeTypes.mistake ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
              Mistakes ({nodes.filter(n => n.type === 'mistake').length})
            </Badge>
            <Badge 
              variant={showNodeTypes.highlight ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleNodeType('highlight')}
            >
              {showNodeTypes.highlight ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
              Highlights ({nodes.filter(n => n.type === 'highlight').length})
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Mindmap Canvas */}
      <Card>
        <CardContent className="p-4">
          <div className="w-full overflow-hidden rounded-lg border bg-background">
            <svg 
              ref={svgRef}
              className="w-full h-[600px]"
              style={{ background: 'hsl(var(--muted))' }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Drag nodes to rearrange • Click to view details • Scroll to zoom
          </div>
        </CardContent>
      </Card>
    </div>
  );
};