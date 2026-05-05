ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS program jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS payment_link text,
  ADD COLUMN IF NOT EXISTS slug text;

CREATE UNIQUE INDEX IF NOT EXISTS trips_slug_unique ON public.trips(slug) WHERE slug IS NOT NULL;