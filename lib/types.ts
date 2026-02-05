export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type PostSummary = Omit<Post, 'content'>;

export interface Album {
  id: string;
  title: string;
  dateTaken: string;
  createdAt: string;
  updatedAt: string;
  cloudinaryFolder: string | null;
  description: string | null;
  coverPublicId: string | null;
  // Computed fields often returned by queries
  _count?: {
    photos: number;
  };
  randomCoverPublicId?: string | null;
}

export interface Member {
  id: string;
  displayName: string;
  nickname: string | null;
  role: string | null;
  gender: string;
  bio: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  profileId?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string | null;
  isUpcoming: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Season {
  id: string;
  code: string;
  name: string;
}

export interface Result {
  id: string;
  date: string;
  venue: string;
  teamName: string;
  placement: number;
  score: number;
  note: string | null;
  season: Season;
  memberIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Playlist {
  id: string;
  title: string;
  spotifyUrl: string;
  description: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- NEW TEAM TYPES ---

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: 'member' | 'admin' | 'moderator';
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  entity_id: string;
  entity_type: 'post' | 'event' | 'album';
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined profile
  profile?: Profile;
}

export type EventStatus = 'going' | 'maybe' | 'not_going';

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  status: EventStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
  // Joined profile
  profile?: Profile;
}
