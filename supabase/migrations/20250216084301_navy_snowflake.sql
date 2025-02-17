-- First, delete all song variations
DELETE FROM public.song_variations;

-- Then delete all songs
DELETE FROM public.songs;

-- Then delete all profiles
DELETE FROM public.profiles;

-- Finally delete all users from auth.users
DELETE FROM auth.users;

-- Reset sequences if any
ALTER SEQUENCE IF EXISTS auth.users_id_seq RESTART;

-- Verify cleanup
DO $$ 
BEGIN
  -- Verify no orphaned song variations exist
  ASSERT (SELECT COUNT(*) FROM public.song_variations) = 0, 
    'Song variations table should be empty';

  -- Verify no orphaned songs exist
  ASSERT (SELECT COUNT(*) FROM public.songs) = 0,
    'Songs table should be empty';

  -- Verify no orphaned profiles exist
  ASSERT (SELECT COUNT(*) FROM public.profiles) = 0,
    'Profiles table should be empty';

  -- Verify no users exist
  ASSERT (SELECT COUNT(*) FROM auth.users) = 0,
    'Users table should be empty';
END $$;