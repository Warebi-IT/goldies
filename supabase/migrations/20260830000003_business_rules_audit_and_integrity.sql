-- Migration: Business Rules & Audit Trail Engine
-- Implements:
-- 1. Soft-delete enforcement on trips with active bookings
-- 2. Audit Trail (audit_events) for all critical customer and admin lifecycle events
-- 3. Price snapshotting (price_at_booking) on bookings
-- 4. Medical alert and insurance tracking columns on bookings

-- A. Audit Events Table
CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'booking', 'trip', 'contact', 'admin', 'system'
  entity_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit events"
ON public.audit_events FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert audit events"
ON public.audit_events FOR INSERT
WITH CHECK (true);

-- Helper function to log audit events easily from frontend or triggers
CREATE OR REPLACE FUNCTION public.log_audit_event(
  _action TEXT,
  _entity_type TEXT,
  _entity_id TEXT,
  _details JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_id UUID;
  v_actor_email TEXT;
  v_event_id UUID;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NOT NULL THEN
    SELECT email INTO v_actor_email FROM auth.users WHERE id = v_actor_id;
  END IF;

  INSERT INTO public.audit_events (
    actor_id,
    actor_email,
    action,
    entity_type,
    entity_id,
    details
  ) VALUES (
    v_actor_id,
    v_actor_email,
    _action,
    _entity_type,
    _entity_id,
    _details
  ) RETURNING id INTO v_event_id;

  RETURN v_event_id;
END;
$$;

-- B. Enhance bookings table with Price Snapshotting, Medical Alert, and Insurance Status
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS price_at_booking INTEGER,
  ADD COLUMN IF NOT EXISTS has_medical_alert BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS medical_alert_acknowledged BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS insurance_verified BOOLEAN NOT NULL DEFAULT false;

-- C. Soft-delete Trigger on trips: Forbid hard deletion if bookings exist
CREATE OR REPLACE FUNCTION public.prevent_trip_delete_with_bookings()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT count(*) INTO v_count FROM public.bookings WHERE trip_id = OLD.id;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Action bloquée par la règle de gestion : % inscription(s) sont rattachée(s) à ce voyage. Vous devez désactiver le voyage au lieu de le supprimer.', v_count;
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_trip_delete ON public.trips;
CREATE TRIGGER trg_prevent_trip_delete
BEFORE DELETE ON public.trips
FOR EACH ROW
EXECUTE FUNCTION public.prevent_trip_delete_with_bookings();
