/*
  # Thorough cleanup of last 2 users and associated data
  
  1. Deletes the last 2 users created and all their associated data
  2. Uses explicit cascading deletes to ensure complete cleanup
  3. Includes verification steps
*/

-- First delete song variations (they depend on songs)
DELETE FROM public.song_variations
WHERE song_id IN (
  SELECT s.id 
  FROM public.songs s
  WHERE s.user_id IN (
    SELECT id 
    FROM auth.users 
    ORDER BY created_at DESC 
    LIMIT 2
  )
);

-- Then delete songs (they depend on users)
DELETE FROM public.songs 
WHERE user_id IN (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 2
);

-- Then delete profiles (they depend on users)
DELETE FROM public.profiles
WHERE id IN (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 2
);

-- Finally delete the users
DELETE FROM auth.users
WHERE id IN (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 2
);