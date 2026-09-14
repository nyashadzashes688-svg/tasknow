export type UserRole = "client" | "provider";

export type ServiceCategory =
  | "plumbing"
  | "cleaning"
  | "tutoring"
  | "beauty"
  | "handyman"
  | "electrical"
  | "painting"
  | "moving"
  | "landscaping"
  | "other";

export type BookingStatus =
  | "pending"
  | "accepted"
  | "en_route"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled";

export type SubscriptionTier = "free" | "basic" | "pro" | "enterprise";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface Provider extends User {
  role: "provider";
  categories: ServiceCategory[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  bio: string;
  isVerified: boolean;
  isAvailable: boolean;
  documentsUploaded: boolean;
  completedJobs: number;
  location?: { lat: number; lng: number; address: string };
}

export interface Client extends User {
  role: "client";
  savedAddresses: { label: string; address: string; lat: number; lng: number }[];
}

export interface Booking {
  id: string;
  clientId: string;
  providerId: string;
  category: ServiceCategory;
  title: string;
  description: string;
  status: BookingStatus;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  location: { lat: number; lng: number };
  estimatedCost: number;
  actualCost?: number;
  rating?: number;
  review?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  bookingId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  period: "month" | "year";
  features: string[];
  jobLimit: number | null;
  highlighted?: boolean;
}

export interface ServiceItem {
  category: ServiceCategory;
  name: string;
  icon: string;
  description: string;
  startingPrice: number;
}
