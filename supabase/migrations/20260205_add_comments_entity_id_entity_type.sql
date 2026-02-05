-- Přidání entity_id a entity_type do comments (bez mazání post_slug pro zpětnou kompatibilitu)
ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS entity_id text,
  ADD COLUMN IF NOT EXISTS entity_type text NOT NULL DEFAULT 'post';

-- Nastavení entity_id z post_slug pro existující záznamy (jen pokud post_slug existuje)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'post_slug') THEN
    UPDATE public.comments SET entity_id = post_slug WHERE entity_id IS NULL;
  END IF;
END $$;

-- Nastavit NOT NULL pro entity_id
ALTER TABLE public.comments ALTER COLUMN entity_id SET NOT NULL;

-- Index pro rychlejší dotazy
CREATE INDEX IF NOT EXISTS idx_comments_entity_id ON public.comments(entity_id);
