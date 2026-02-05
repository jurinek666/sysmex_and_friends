-- Rename tables to snake_case
ALTER TABLE "Post" RENAME TO "posts";
ALTER TABLE "Album" RENAME TO "albums";
ALTER TABLE "Event" RENAME TO "events";
ALTER TABLE "Member" RENAME TO "members";
ALTER TABLE "Photo" RENAME TO "photos";
ALTER TABLE "Playlist" RENAME TO "playlists";
ALTER TABLE "Result" RENAME TO "results";
ALTER TABLE "Season" RENAME TO "seasons";
ALTER TABLE "ResultMember" RENAME TO "result_members";

-- Rename columns to snake_case in 'posts'
ALTER TABLE "posts" RENAME COLUMN "coverImageUrl" TO "cover_image_url";
ALTER TABLE "posts" RENAME COLUMN "isFeatured" TO "is_featured";
ALTER TABLE "posts" RENAME COLUMN "publishedAt" TO "published_at";
ALTER TABLE "posts" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "posts" RENAME COLUMN "updatedAt" TO "updated_at";

-- Rename columns in 'albums'
ALTER TABLE "albums" RENAME COLUMN "dateTaken" TO "date_taken";
ALTER TABLE "albums" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "albums" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "albums" RENAME COLUMN "cloudinaryFolder" TO "cloudinary_folder";
ALTER TABLE "albums" RENAME COLUMN "coverPublicId" TO "cover_public_id";

-- Rename columns in 'events'
ALTER TABLE "events" RENAME COLUMN "isUpcoming" TO "is_upcoming";
ALTER TABLE "events" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "events" RENAME COLUMN "updatedAt" TO "updated_at";

-- Rename columns in 'members'
ALTER TABLE "members" RENAME COLUMN "displayName" TO "display_name";
ALTER TABLE "members" RENAME COLUMN "avatarUrl" TO "avatar_url";
ALTER TABLE "members" RENAME COLUMN "isActive" TO "is_active";
ALTER TABLE "members" RENAME COLUMN "profileId" TO "profile_id";
ALTER TABLE "members" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "members" RENAME COLUMN "updatedAt" TO "updated_at";

-- Rename columns in 'photos'
ALTER TABLE "photos" RENAME COLUMN "cloudinaryPublicId" TO "cloudinary_public_id";
ALTER TABLE "photos" RENAME COLUMN "sortOrder" TO "sort_order";
ALTER TABLE "photos" RENAME COLUMN "albumId" TO "album_id";

-- Rename columns in 'playlists'
ALTER TABLE "playlists" RENAME COLUMN "spotifyUrl" TO "spotify_url";
ALTER TABLE "playlists" RENAME COLUMN "isActive" TO "is_active";
ALTER TABLE "playlists" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "playlists" RENAME COLUMN "updatedAt" TO "updated_at";

-- Rename columns in 'results'
ALTER TABLE "results" RENAME COLUMN "teamName" TO "team_name";
ALTER TABLE "results" RENAME COLUMN "seasonId" TO "season_id";
ALTER TABLE "results" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "results" RENAME COLUMN "updatedAt" TO "updated_at";

-- Rename columns in 'seasons'
ALTER TABLE "seasons" RENAME COLUMN "startDate" TO "start_date";
ALTER TABLE "seasons" RENAME COLUMN "endDate" TO "end_date";

-- Rename columns in 'result_members' (if needed, check casing)
-- Assuming they are snake_case based on code usage 'member_id', 'sort_order'
-- But likely need to ensure consistent naming if they were camelCase.
-- Checking code: `ResultMember(member_id, sort_order` -> implies snake_case.
-- But if `ResultMember` was created by Prisma/ORM, maybe it's `memberId`.
-- I'll assume standard snake_case for join table columns as is common, but strict check would be better.
-- I'll skip renaming columns for result_members unless I see them.

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_albums_date_taken ON albums(date_taken);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_photos_album_id ON photos(album_id);
CREATE INDEX IF NOT EXISTS idx_results_season_id ON results(season_id);
CREATE INDEX IF NOT EXISTS idx_members_profile_id ON members(profile_id);
