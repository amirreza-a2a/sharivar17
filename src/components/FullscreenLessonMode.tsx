import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { 
  X, 
  Send,
  Search,
  Download,
  FileText,
  Code,
  ExternalLink,
  Copy,
  CheckCircle,
  Clock,
  Trophy,
  Star,
  ArrowRight,
  MessageSquare,
  FileIcon
} from "lucide-react";
import { SubLesson, UserProgress, Module, Lesson } from "@/types/lesson";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FullscreenLessonModeProps {
  isOpen: boolean;
  onClose: () => void;
  subLesson: SubLesson;
  moduleId: string;
  lessonId: string;
  userProgress: UserProgress;
  modules: Module[];
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function FullscreenLessonMode({
  isOpen,
  onClose,
  subLesson,
  moduleId,
  lessonId,
  userProgress,
  modules,
  onComplete,
  onNext,
  onPrevious
}: FullscreenLessonModeProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resourceSearch, setResourceSearch] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Calculate lesson progress
  useEffect(() => {
    const module = modules.find(m => m.id === moduleId);
    const lesson = module?.lessons.find(l => l.id === lessonId);
    if (lesson) {
      setLessonProgress(lesson.progress);
    }
  }, [modules, moduleId, lessonId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleLessonComplete = () => {
    onComplete();
    setShowSummary(true);
  };

  const handleContinueToNext = () => {
    setShowSummary(false);
    if (onNext) {
      onNext();
    } else {
      onClose();
    }
  };

  const handleReturnToDashboard = () => {
    setShowSummary(false);
    onClose();
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Simulate AI response for now
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `I understand you're asking about "${userMessage}". In the context of this lesson on "${subLesson.title}", let me help you understand this concept better. This relates to the key topics we're covering in this module.` 
        }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to send message");
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Mock resources data
  const resources = [
    {
      id: '1',
      title: 'STM32 GPIO Reference',
      type: 'pdf',
      size: '2.3 MB',
      description: 'Complete reference for GPIO configuration'
    },
    {
      id: '2',
      title: 'Code Examples',
      type: 'code',
      size: '15 files',
      description: 'Sample code for lesson exercises'
    },
    {
      id: '3',
      title: 'External Documentation',
      type: 'link',
      size: 'Online',
      description: 'Official STM32 documentation'
    },
    {
      id: '4',
      title: 'Lesson Notes',
      type: 'text',
      size: '1.2 MB',
      description: 'Additional reading material'
    }
  ];

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(resourceSearch.toLowerCase()) ||
    resource.description.toLowerCase().includes(resourceSearch.toLowerCase())
  );

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      case 'link': return <ExternalLink className="w-4 h-4" />;
      default: return <FileIcon className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  // Lesson Summary Screen
  if (showSummary) {
    return (
      <div className="fixed inset-0 z-50 bg-background animate-fade-in">
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* Success Animation */}
            <div className="relative">
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-success to-info rounded-full animate-pulse opacity-20"></div>
                <div className="absolute inset-4 bg-gradient-to-r from-success to-info rounded-full flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white animate-scale-in" />
                </div>
              </div>
            </div>

            {/* Completion Message */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold gradient-text">
                🎉 Great job!
              </h1>
              <p className="text-xl text-muted-foreground">
                You've completed "{subLesson.title}"
              </p>
            </div>

            {/* Progress Update */}
            <div className="bg-card border rounded-2xl p-8 space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">+25</div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-info">{Math.round(lessonProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Course Progress</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Course Progress</span>
                  <span>{Math.round(lessonProgress)}%</span>
                </div>
                <Progress value={lessonProgress} className="h-3" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {onNext && (
                <Button 
                  onClick={handleContinueToNext}
                  size="lg"
                  className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Continue to Next Lesson
                </Button>
              )}
              <Button 
                onClick={handleReturnToDashboard}
                variant="outline"
                size="lg"
                className="px-8 py-4 rounded-xl font-semibold"
              >
                Return to Lessons
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Fullscreen Lesson View
  return (
    <div className="fixed inset-0 z-50 bg-gray-900 animate-fade-in">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          {/* Left: Navigation */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-700 text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg text-white truncate max-w-md">{subLesson.title}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{subLesson.estimatedTime} min</span>
              </div>
            </div>
          </div>

          {/* Center: Progress */}
          <div className="flex-1 max-w-md mx-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Lesson Progress</span>
                <span>{Math.round(lessonProgress)}%</span>
              </div>
              <Progress value={lessonProgress} className="h-2 bg-gray-700" />
            </div>
          </div>

          {/* Right: Complete Button */}
          <div className="flex items-center space-x-3">
            {!subLesson.completed && !subLesson.quiz && (
              <Button 
                onClick={handleLessonComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Dual Panel Layout */}
      <div className="h-[calc(100vh-80px)]">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel: AI Chat Assistant */}
          <ResizablePanel defaultSize={65} minSize={40} className="bg-gray-900">
            <div className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <h2 className="font-semibold text-white">Chat Assistant</h2>
                </div>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Ask me anything about this lesson!</p>
                    </div>
                  )}
                  
                  {chatMessages.map((message, index) => (
                    <div key={index} className={cn(
                      "flex",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}>
                      <div className={cn(
                        "max-w-[80%] p-3 rounded-lg",
                        message.role === 'user' 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-800 text-gray-100 border border-gray-700"
                      )}>
                        {message.role === 'assistant' && message.content.includes('```') ? (
                          <div className="space-y-2">
                            {message.content.split('```').map((part, idx) => (
                              <div key={idx}>
                                {idx % 2 === 0 ? (
                                  <p className="whitespace-pre-wrap">{part}</p>
                                ) : (
                                  <div className="relative bg-gray-900 border border-gray-600 rounded p-3">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(part)}
                                      className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                    <code className="text-sm text-green-400">{part}</code>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 border border-gray-700 text-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="bg-gray-800 border-t border-gray-700 p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask anything..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-gray-700 hover:bg-gray-600" />

          {/* Right Panel: Resources */}
          <ResizablePanel defaultSize={35} minSize={25} className="bg-gray-850">
            <div className="h-full flex flex-col">
              {/* Resources Header */}
              <div className="bg-gray-800 border-b border-gray-700 p-4">
                <h2 className="font-semibold text-white mb-3">Resources</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search resources..."
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Resources List */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {filteredResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="text-blue-400 mt-1">
                            {getResourceIcon(resource.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white truncate">{resource.title}</h3>
                            <p className="text-sm text-gray-400 mt-1">{resource.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                                {resource.type.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-gray-500">{resource.size}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300 hover:bg-gray-700 ml-2"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}