/*
  # Check existing users
  
  This migration checks for existing users in the database.
*/

-- Select all users and their profiles
SELECT 
  u.id,
  u.email,
  u.created_at,
  p.baby_name,
  p.preferred_language
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at DESC;