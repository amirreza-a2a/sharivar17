import type { StartupIdea, Mentor, MentorshipRequest } from "@/types/startup";

const STARTUP_IDEAS_KEY = "startup_ideas";
const MENTORSHIP_REQUESTS_KEY = "mentorship_requests";

export const startupStorage = {
  // Startup Ideas
  getIdeas(): StartupIdea[] {
    const stored = localStorage.getItem(STARTUP_IDEAS_KEY);
    if (!stored) return [];
    return JSON.parse(stored).map((idea: any) => ({
      ...idea,
      createdAt: new Date(idea.createdAt),
      updatedAt: new Date(idea.updatedAt),
    }));
  },

  saveIdea(idea: Omit<StartupIdea, "id" | "createdAt" | "updatedAt">): StartupIdea {
    const ideas = this.getIdeas();
    const newIdea: StartupIdea = {
      ...idea,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    ideas.push(newIdea);
    localStorage.setItem(STARTUP_IDEAS_KEY, JSON.stringify(ideas));
    return newIdea;
  },

  updateIdea(id: string, updates: Partial<StartupIdea>): StartupIdea | null {
    const ideas = this.getIdeas();
    const index = ideas.findIndex(idea => idea.id === id);
    if (index === -1) return null;
    
    ideas[index] = { ...ideas[index], ...updates, updatedAt: new Date() };
    localStorage.setItem(STARTUP_IDEAS_KEY, JSON.stringify(ideas));
    return ideas[index];
  },

  deleteIdea(id: string): boolean {
    const ideas = this.getIdeas();
    const filtered = ideas.filter(idea => idea.id !== id);
    if (filtered.length === ideas.length) return false;
    localStorage.setItem(STARTUP_IDEAS_KEY, JSON.stringify(filtered));
    return true;
  },

  // Mentorship Requests
  getRequests(): MentorshipRequest[] {
    const stored = localStorage.getItem(MENTORSHIP_REQUESTS_KEY);
    if (!stored) return [];
    return JSON.parse(stored).map((req: any) => ({
      ...req,
      createdAt: new Date(req.createdAt),
      scheduledAt: req.scheduledAt ? new Date(req.scheduledAt) : undefined,
    }));
  },

  saveRequest(request: Omit<MentorshipRequest, "id" | "createdAt">): MentorshipRequest {
    const requests = this.getRequests();
    const newRequest: MentorshipRequest = {
      ...request,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    requests.push(newRequest);
    localStorage.setItem(MENTORSHIP_REQUESTS_KEY, JSON.stringify(requests));
    return newRequest;
  },
};

// Mock mentors data
export const mockMentors: Mentor[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Former Y Combinator Partner",
    company: "TechStars",
    expertise: ["Product Strategy", "Fundraising", "B2B SaaS"],
    bio: "15+ years in startup ecosystem. Helped 100+ startups raise over $500M.",
    avatar: "/placeholder.svg",
    rating: 4.9,
    sessionsCompleted: 150,
    pricePerHour: 200,
    availability: "available"
  },
  {
    id: "2", 
    name: "Marcus Rodriguez",
    title: "CTO & Co-founder",
    company: "DataViz Inc.",
    expertise: ["Technical Architecture", "Team Building", "AI/ML"],
    bio: "Built and scaled engineering teams from 5 to 150+ developers.",
    avatar: "/placeholder.svg",
    rating: 4.8,
    sessionsCompleted: 89,
    pricePerHour: 180,
    availability: "available"
  },
  {
    id: "3",
    name: "Dr. Amanda Park",
    title: "Innovation Professor",
    company: "Stanford University", 
    expertise: ["Market Research", "Business Models", "Academic Partnerships"],
    bio: "Research-focused entrepreneur with 20+ published papers on innovation.",
    avatar: "/placeholder.svg",
    rating: 4.7,
    sessionsCompleted: 200,
    availability: "busy"
  }
];