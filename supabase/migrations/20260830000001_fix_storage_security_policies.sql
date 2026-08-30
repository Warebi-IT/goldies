-- Migration: Tighten Storage RLS policies for 'gallery' bucket
-- Prevents any non-admin authenticated user from deleting, uploading, or replacing gallery objects.

DROP POLICY IF EXISTS "Authenticated users can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON storage.objects;

-- Only verified Admins can insert, update, or delete gallery storage objects
CREATE POLICY "Admins can upload gallery images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'gallery' AND 
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update gallery images" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'gallery' AND 
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete gallery images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'gallery' AND 
  public.has_role(auth.uid(), 'admin')
);
