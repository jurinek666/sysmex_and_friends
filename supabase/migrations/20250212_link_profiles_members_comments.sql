-- 1. Update Member table
ALTER TABLE "Member"
ADD COLUMN IF NOT EXISTS "profile_id" UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT,
ADD CONSTRAINT "Member_profile_id_key" UNIQUE ("profile_id");

-- 2. Update comments table
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS entity_type TEXT NOT NULL DEFAULT 'post';

-- Rename post_slug to entity_id if it exists
DO $$
BEGIN
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'post_slug') THEN
    ALTER TABLE public.comments RENAME COLUMN post_slug TO entity_id;
  END IF;
END $$;

-- 3. Create Sync Function
CREATE OR REPLACE FUNCTION public.sync_member_from_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If the profile is linked to a Member, update the Member's info
  UPDATE "Member"
  SET
    "displayName" = NEW.display_name,
    "avatarUrl" = NEW.avatar_url,
    "updatedAt" = NOW()
  WHERE "profile_id" = NEW.id;

  RETURN NEW;
END;
$$;

-- 4. Create Trigger
DROP TRIGGER IF EXISTS on_profile_update_sync_member ON public.profiles;
CREATE TRIGGER on_profile_update_sync_member
AFTER UPDATE OF display_name, avatar_url ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_member_from_profile();
