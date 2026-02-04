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
  isActive: boolean;
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
