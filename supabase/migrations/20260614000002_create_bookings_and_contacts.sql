CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  age INTEGER NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  disponibilite BOOLEAN NOT NULL DEFAULT true,
  allergies TEXT NOT NULL,
  engagement TEXT NOT NULL,
  assurance TEXT NOT NULL,
  autre TEXT,
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  destination TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Bookings policies
CREATE POLICY "Anyone can insert bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage bookings" 
ON public.bookings FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin')) 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Contacts policies
CREATE POLICY "Anyone can insert contacts" 
ON public.contacts FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage contacts" 
ON public.contacts FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin')) 
WITH CHECK (public.has_role(auth.uid(), 'admin'));
