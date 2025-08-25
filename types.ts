

export interface SearchCriteria {
  query: string;
  category: string;
  subcategory: string;
  level: string;
  industry: string;
  deliveryTime: string;
  searchSource: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  summary: string;
  fullDescription: string;
  skills: string[];
  payRange: string;
  jobType: string;
  postedDate: string;
  sourceUrl:string;
  sourceName: string;
  matchPercentage: number;
  companyRating?: string;
  companyLogoUrl?: string | null;
  payEstimate?: string | null;
  redFlags?: string[];
}

export interface Project extends Job {
  projectId: string; // A new unique ID for the project entry itself
  totalTrackedSeconds: number;
  isTracking: boolean;
  startTime?: number; // Timestamp
  status: 'active' | 'completed';
  projectValue: number;
}

export interface JobCategory {
  name: string;
  subcategories: string[];
}

export type SortOption = 'relevance' | 'date' | 'pay-desc' | 'match';

export enum DocumentType {
  PROPOSAL = 'Proposal',
  EMAIL = 'Cover Email',
  CV = 'CV Highlights',
}

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'agency';

export interface SubscriptionState {
  status: SubscriptionTier;
  searchesLeft: number;
  expiry?: number;
}

export interface SkillGapAnalysis {
  matchingSkills: string[];
  missingSkills: string[];
  summary: string;
}

export type UnlockedFeature = 'payEstimate' | 'redFlags' | 'skillAnalysis' | null;

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
}

export interface UserProfile {
  name: string;
  headline: string;
  skills: string[];
  portfolio: PortfolioItem[];
  rate: number;
  availability: 'available' | 'soon' | 'not-available';
}

export interface ForumPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface ForumThread {
  id: string;
  title: string;
  author: string;
  posts: ForumPost[];
  createdAt: string;
  category: string;
}

export interface MarketInsightsRequest {
  category: string;
  level: string;
  location: string;
}

export interface RateInfo {
  range: string;
  basis: string;
}

export interface DemandSkill {
  name: string;
  skills: string;
  demand: 'high' | 'medium' | 'stable';
}

export interface Hotspot {
  location: string;
  details: string;
  demand: 'high' | 'medium' | 'stable';
}

export interface MarketTrend {
  name: string;
  details: string;
  demand: 'high' | 'medium' | 'stable';
}

export interface MarketInsights {
  averageHourlyRate: RateInfo;
  averageProjectRate: RateInfo;
  topInDemandSkills: DemandSkill[];
  geographicHotspots: Hotspot[];
  marketTrends: MarketTrend[];
}

export interface Testimonial {
    id: number;
    quote: string;
    author: string;
    details: string;
}


export type View = 'search' | 'profile' | 'projects' | 'community' | 'insights' | 'dashboard' | 'pricing' | 'guide' | 'privacy' | 'terms' | 'aup' | 'contact' | 'faq' | 'refund';

export interface DashboardData {
    applications: number;
    earnings: number;
    successRate: number;
    responseTime: number; // in hours
}

export interface Activity {
    id: string;
    type: 'document' | 'project' | 'search';
    description: string;
    timestamp: string;
}

export interface SearchHistoryItem {
    id: string;
    criteria: SearchCriteria;
    timestamp: string;
}