import { useState } from "react";
import { Video, MessageCircle, Clock, Star, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockMentors, startupStorage } from "@/utils/startupStorage";
import type { Mentor, MentorshipRequest } from "@/types/startup";
import { toast } from "sonner";

function MentorCard({ mentor }: { mentor: Mentor }) {
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [requestData, setRequestData] = useState({
    startupId: "",
    type: "chat" as const,
    message: ""
  });

  const ideas = startupStorage.getIdeas();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestData.message.trim()) {
      toast.error("Please write a message");
      return;
    }

    startupStorage.saveRequest({
      ...requestData,
      mentorId: mentor.id,
      status: "pending"
    });

    setRequestData({ startupId: "", type: "chat", message: "" });
    setIsRequestOpen(false);
    toast.success(`Request sent to ${mentor.name}`);
  };

  const availabilityColor = {
    available: "bg-green-500",
    busy: "bg-yellow-500", 
    offline: "bg-gray-500"
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage src={mentor.avatar} alt={mentor.name} />
              <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${availabilityColor[mentor.availability]}`} />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{mentor.name}</CardTitle>
            <p className="text-sm font-medium text-muted-foreground">{mentor.title}</p>
            <p className="text-sm text-muted-foreground">{mentor.company}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{mentor.rating}</span>
            </div>
            <p className="text-xs text-muted-foreground">{mentor.sessionsCompleted} sessions</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{mentor.bio}</p>
        
        <div className="flex flex-wrap gap-1">
          {mentor.expertise.map(skill => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        {mentor.pricePerHour && (
          <div className="text-sm font-medium">
            ${mentor.pricePerHour}/hour
          </div>
        )}

        <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full" 
              disabled={mentor.availability === "offline"}
            >
              <Send className="w-4 h-4 mr-2" />
              Request Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Session with {mentor.name}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Startup Project (Optional)</Label>
                <Select 
                  value={requestData.startupId} 
                  onValueChange={(value) => setRequestData(prev => ({ ...prev, startupId: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a project to discuss" />
                  </SelectTrigger>
                  <SelectContent>
                    {ideas.map(idea => (
                      <SelectItem key={idea.id} value={idea.id}>
                        {idea.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Session Type</Label>
                <Select 
                  value={requestData.type} 
                  onValueChange={(value: any) => setRequestData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chat">Text Chat</SelectItem>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="async">Async Q&A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Message</Label>
                <Textarea
                  value={requestData.message}
                  onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Describe what you'd like to discuss..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <Button type="submit" className="w-full">
                Send Request
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default function MentorshipHub() {
  const [requests, setRequests] = useState(() => startupStorage.getRequests());
  const [filter, setFilter] = useState("all");

  const filteredMentors = filter === "all" 
    ? mockMentors 
    : mockMentors.filter(mentor => mentor.expertise.some(skill => 
        skill.toLowerCase().includes(filter.toLowerCase())
      ));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mentorship Hub</h1>
        <p className="text-muted-foreground">
          Connect with experienced mentors to guide your startup journey.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5" />
              Available Mentors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMentors.filter(m => m.availability === "available").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Send className="w-5 h-5" />
              Requests Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="w-5 h-5" />
              Sessions Booked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter(r => r.status === "accepted").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5" />
              Avg Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto">
        <Button 
          variant={filter === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Mentors
        </Button>
        <Button 
          variant={filter === "Product" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("Product")}
        >
          Product Strategy
        </Button>
        <Button 
          variant={filter === "Technical" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("Technical")}
        >
          Technical
        </Button>
        <Button 
          variant={filter === "Fundraising" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("Fundraising")}
        >
          Fundraising
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map(mentor => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))}
      </div>

      {requests.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
          <div className="space-y-3">
            {requests.slice(-3).map(request => {
              const mentor = mockMentors.find(m => m.id === request.mentorId);
              return (
                <Card key={request.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{mentor?.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {request.message}
                      </p>
                    </div>
                    <Badge variant={
                      request.status === "accepted" ? "default" :
                      request.status === "pending" ? "secondary" : "outline"
                    }>
                      {request.status}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}