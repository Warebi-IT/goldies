-- Migration: Add missing booking fields, telephone on contacts, and flexible constraints
-- Date: 2026-09-04

-- 1. Add missing columns to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS has_medical_alert BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS medical_alert_acknowledged BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS insurance_verified BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS price_at_booking NUMERIC;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS submission_action TEXT DEFAULT 'payer';

-- 2. Drop NOT NULL constraints on fields to allow optional inputs and lead capture on cancel / contact request
ALTER TABLE public.bookings ALTER COLUMN allergies DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN age DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN engagement DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN assurance DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN disponibilite DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN telephone DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN nom DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN prenom DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN email DROP NOT NULL;

-- 3. Add telephone to contacts
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS telephone TEXT;
ALTER TABLE public.contacts ALTER COLUMN message DROP NOT NULL;
