export interface StartupIdea {
  id: string;
  title: string;
  problem: string;
  solution: string;
  targetMarket: string;
  team: string;
  stage: "idea" | "validation" | "prototype" | "launched";
  createdAt: Date;
  updatedAt: Date;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  bio: string;
  avatar: string;
  rating: number;
  sessionsCompleted: number;
  pricePerHour?: number;
  availability: "available" | "busy" | "offline";
}

export interface MentorshipRequest {
  id: string;
  startupId: string;
  mentorId: string;
  type: "chat" | "video" | "async";
  message: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  scheduledAt?: Date;
  createdAt: Date;
}