/*
  # Check users state
  
  This migration checks the current state of users and their profiles.
*/

-- First, show all users
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.raw_user_meta_data,
  p.baby_name,
  p.preferred_language,
  p.created_at as profile_created_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at DESC;

-- Then show any orphaned profiles (profiles without users)
SELECT p.*
FROM public.profiles p
LEFT JOIN auth.users u ON u.id = p.id
WHERE u.id IS NULL;

-- Show any duplicate emails
SELECT email, COUNT(*) as count
FROM auth.users
GROUP BY email
HAVING COUNT(*) > 1;