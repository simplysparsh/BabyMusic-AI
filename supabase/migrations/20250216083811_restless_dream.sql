-- First, get all auth users
WITH auth_users AS (
  SELECT id, email, created_at
  FROM auth.users
),
-- Find any inconsistencies
inconsistent_users AS (
  SELECT au.id, au.email
  FROM auth_users au
  LEFT JOIN public.profiles p ON p.id = au.id
  WHERE p.id IS NULL
)
-- Remove any auth users without profiles
DELETE FROM auth.users
WHERE id IN (
  SELECT id FROM inconsistent_users
);

-- Verify email uniqueness
DELETE FROM auth.users a
    USING auth.users b
    WHERE a.email = b.email 
    AND a.created_at < b.created_at;

-- Clean up any orphaned profiles
DELETE FROM public.profiles
WHERE id NOT IN (SELECT id FROM auth.users);