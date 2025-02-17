/*
  # Clean up orphaned data

  1. Data Cleanup
    - Remove song variations without valid songs
    - Remove songs without valid users
    - Remove profiles without valid users
    - Remove auth users without profiles
    - Remove duplicate email registrations

  2. Verification
    - Verify all relationships are valid
    - Ensure referential integrity
*/

-- First, remove any song variations without valid songs
DELETE FROM public.song_variations
WHERE song_id NOT IN (SELECT id FROM public.songs);

-- Remove songs without valid users
DELETE FROM public.songs
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Remove profiles without valid users
DELETE FROM public.profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- Remove auth users without profiles
DELETE FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- For any duplicate emails, keep only the most recent registration
WITH duplicates AS (
  SELECT email, array_agg(id ORDER BY created_at DESC) as ids
  FROM auth.users
  GROUP BY email
  HAVING COUNT(*) > 1
)
DELETE FROM auth.users
WHERE id IN (
  SELECT unnest(ids[2:]) -- Keep first (most recent) ID, delete others
  FROM duplicates
);

-- Final verification: Remove any remaining orphaned data
DO $$ 
BEGIN
  -- Remove any remaining song variations without valid songs
  DELETE FROM public.song_variations
  WHERE song_id NOT IN (SELECT id FROM public.songs);

  -- Remove any remaining songs without valid users
  DELETE FROM public.songs
  WHERE user_id NOT IN (SELECT id FROM auth.users);

  -- Remove any remaining profiles without valid users
  DELETE FROM public.profiles
  WHERE id NOT IN (SELECT id FROM auth.users);
END $$;