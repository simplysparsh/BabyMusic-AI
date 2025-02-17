/*
  # Clean up users and profiles

  1. Changes
    - Delete any orphaned profiles (profiles without users)
    - Delete any users without profiles
    - Delete any duplicate email registrations
*/

-- First, delete any orphaned profiles
DELETE FROM public.profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- Then delete any users without profiles
DELETE FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- Finally, for any duplicate emails, keep only the most recent registration
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