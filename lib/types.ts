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
