-- Migration: Ensure public booking access without backend permissions & audit table readiness
-- Date: 2026-09-09

-- 1. Create audit_events if not exists
CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit events" ON public.audit_events;
CREATE POLICY "Admins can view audit events"
ON public.audit_events FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can insert audit events" ON public.audit_events;
CREATE POLICY "Anyone can insert audit events"
ON public.audit_events FOR INSERT
WITH CHECK (true);

-- 2. Explicitly ensure permissions for bookings, contacts, and audit_events
GRANT ALL ON public.audit_events TO postgres, service_role;
GRANT INSERT ON public.audit_events TO anon, authenticated;
GRANT SELECT ON public.audit_events TO authenticated;

GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT INSERT ON public.contacts TO anon, authenticated;
