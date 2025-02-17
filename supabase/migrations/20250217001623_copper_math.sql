/*
  # Delete user with email new@new.com

  1. Overview
    - Safely deletes user with email new@new.com and all associated data
    - Handles deletion in correct order to maintain referential integrity
    - Uses transaction to ensure atomicity

  2. Operations
    - Delete song variations
    - Delete songs
    - Delete profile
    - Delete user
*/

BEGIN;

-- First delete song variations for this user's songs
DELETE FROM public.song_variations
WHERE song_id IN (
  SELECT s.id 
  FROM public.songs s
  WHERE s.user_id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'new@new.com'
  )
);

-- Then delete songs
DELETE FROM public.songs 
WHERE user_id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'new@new.com'
);

-- Then delete profile
DELETE FROM public.profiles
WHERE id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'new@new.com'
);

-- Finally delete the user
DELETE FROM auth.users
WHERE email = 'new@new.com';

COMMIT;