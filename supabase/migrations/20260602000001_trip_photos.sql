CREATE TABLE public.trip_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.trip_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view trip photos"
ON public.trip_photos FOR SELECT
USING (true);

CREATE POLICY "Admins can manage trip photos"
ON public.trip_photos FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
