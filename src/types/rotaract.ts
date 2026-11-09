export type AvenueOfService =
  | 'Club Service'
  | 'Community Service'
  | 'Professional Development'
  | 'International Service'
  | 'Technical & Innovations'
  | 'Sports & Cultural'
  | 'Public Relations';

export type EventStatus = 'upcoming' | 'live' | 'past' | 'completed';

export type UserRole = 'core_team' | 'bod' | 'member';

export type BODApprovalStatus = 'pending' | 'approved' | 'rejected';

export type CoreTeamPosition =
  | 'Club President'
  | 'Club Secretary'
  | 'Club Treasurer'
  | 'Club Vice President'
  | 'Admin Secretary'
  | 'Reporting Secretary'
  | 'Finance Director'
  | 'Sergeant at Arms'
  | 'Immediate Past President';

export type BODPosition =
  | 'Professional Development Director'
  | 'Community Service Director'
  | 'Club Service Director'
  | 'Joint Club Service Director'
  | 'International Service Director'
  | 'RRRO & IRRO'
  | 'Public Relations Officer'
  | 'DEI Director'
  | 'Editor'
  | 'Club Snapper';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  position?: string;
  assignedAvenue?: AvenueOfService;
  bodStatus?: BODApprovalStatus;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: number;
  phone?: string;
  photoURL?: string;
  bio?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface RotaractEvent {
  id: string;
  title: string;
  avenue: AvenueOfService;
  status: EventStatus;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24-hour)
  endTime: string; // HH:MM (24-hour)
  venue: string; // e.g. "RSCOE Main Auditorium", "Seminar Hall D-Building"
  chairperson: string;
  coChairperson?: string;
  budget: number; // in INR
  actualExpense?: number;
  expectedAttendees: number;
  actualAttendees?: number;
  description: string;
  objectives: string;
  registrationLink?: string;
  reportSummary?: string;
  isFlagship?: boolean;
  isPinned?: boolean;
  coverImage?: string;
  createdBy?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ClubMember {
  id: string;
  name: string;
  role: string; // e.g. "Club President", "Secretary", "Community Service Director"
  category: 'core' | 'bod' | 'member';
  positionKey?: CoreTeamPosition | BODPosition;
  avenue?: AvenueOfService;
  email: string;
  phone?: string;
  avatarInitials: string;
  photoUrl?: string;
  bio?: string;
  joinedDate?: string;
  department?: string;
  year?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  avenue: AvenueOfService;
  imageUrl?: string;
  date: string;
  impact: string;
  details: string;
  isPinned?: boolean;
  featured?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  recognizedBy: string;
  badge?: string;
  createdAt: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'photo' | 'video';
  category: 'events' | 'projects' | 'general';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  date: string;
  createdAt: number;
}

export interface MembershipApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department?: string;
  year?: string;
  interests: string;
  reason: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'contacted';
}

export type ActiveNavTab =
  | 'dashboard'
  | 'calendar'
  | 'events'
  | 'create_event'
  | 'projects'
  | 'achievements'
  | 'gallery'
  | 'members'
  | 'approvals'
  | 'reports'
  | 'settings';
