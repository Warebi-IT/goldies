-- Migration: GDPR Data Retention & Archiving Policy
-- Implements French & EU regulatory retention periods (RGPD Art. 5.1.e, Code de commerce Art. L. 123-22)

-- 1. Table to log GDPR retention executions
CREATE TABLE IF NOT EXISTS public.gdpr_purge_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  executed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  execution_type TEXT NOT NULL DEFAULT 'manual', -- 'manual' or 'scheduled'
  prospects_purged INTEGER NOT NULL DEFAULT 0,
  unpaid_purged INTEGER NOT NULL DEFAULT 0,
  health_data_cleared INTEGER NOT NULL DEFAULT 0,
  bookings_anonymized INTEGER NOT NULL DEFAULT 0,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gdpr_purge_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view gdpr logs"
ON public.gdpr_purge_logs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Stored Procedure for GDPR Lifecycle Enforcement
CREATE OR REPLACE FUNCTION public.apply_gdpr_retention_policy()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prospects_count INTEGER := 0;
  v_unpaid_count INTEGER := 0;
  v_health_count INTEGER := 0;
  v_anonymized_count INTEGER := 0;
  v_user_id UUID;
  v_result JSON;
BEGIN
  -- Verify caller is admin if called from an authenticated session
  v_user_id := auth.uid();
  IF v_user_id IS NOT NULL AND NOT public.has_role(v_user_id, 'admin') THEN
    RAISE EXCEPTION 'Accès refusé : Seuls les administrateurs peuvent exécuter la maintenance RGPD.';
  END IF;

  -- Step A: Purge prospect contacts older than 3 years (RGPD prospect limit)
  WITH deleted_prospects AS (
    DELETE FROM public.contacts
    WHERE created_at < (now() - INTERVAL '3 years')
    RETURNING id
  )
  SELECT count(*) INTO v_prospects_count FROM deleted_prospects;

  -- Step B: Purge abandoned/unpaid bookings older than 90 days
  WITH deleted_unpaid AS (
    DELETE FROM public.bookings
    WHERE payment_status = 'unpaid'
      AND created_at < (now() - INTERVAL '90 days')
    RETURNING id
  )
  SELECT count(*) INTO v_unpaid_count FROM deleted_unpaid;

  -- Step C: Clear sensitive health/allergies data from bookings older than 1 year (Post-stay cleanup)
  WITH cleared_health AS (
    UPDATE public.bookings
    SET allergies = '[PURGÉ_RGPD]',
        autre = NULL
    WHERE created_at < (now() - INTERVAL '1 year')
      AND allergies <> '[PURGÉ_RGPD]'
    RETURNING id
  )
  SELECT count(*) INTO v_health_count FROM cleared_health;

  -- Step D: Fully anonymize client identity on paid bookings older than 10 years (Code de commerce retention passed)
  WITH anonymized_bookings AS (
    UPDATE public.bookings
    SET nom = 'ANONYMISÉ',
        prenom = 'CLIENT_ARCHIVÉ',
        email = 'archive_' || substr(id::text, 1, 8) || '@goldies.anonymized',
        telephone = '0000000000'
    WHERE created_at < (now() - INTERVAL '10 years')
      AND nom <> 'ANONYMISÉ'
    RETURNING id
  )
  SELECT count(*) INTO v_anonymized_count FROM anonymized_bookings;

  -- Step E: Log execution
  INSERT INTO public.gdpr_purge_logs (
    executed_by,
    execution_type,
    prospects_purged,
    unpaid_purged,
    health_data_cleared,
    bookings_anonymized
  ) VALUES (
    v_user_id,
    CASE WHEN v_user_id IS NULL THEN 'scheduled' ELSE 'manual' END,
    v_prospects_count,
    v_unpaid_count,
    v_health_count,
    v_anonymized_count
  );

  -- Return summary JSON
  v_result := json_build_object(
    'prospects_purged', v_prospects_count,
    'unpaid_purged', v_unpaid_count,
    'health_data_cleared', v_health_count,
    'bookings_anonymized', v_anonymized_count,
    'executed_at', now()
  );

  RETURN v_result;
END;
$$;
