/*
  # Clean Database State

  1. Changes
    - Delete all data from all tables
    - Reset sequences
    - Verify cleanup

  2. Safety Measures
    - Uses cascading deletes to maintain referential integrity
    - Verifies all tables are empty after cleanup
*/

-- First delete all song variations
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
  -- Verify no song variations exist
  ASSERT (SELECT COUNT(*) FROM public.song_variations) = 0, 
    'Song variations table should be empty';

  -- Verify no songs exist
  ASSERT (SELECT COUNT(*) FROM public.songs) = 0,
    'Songs table should be empty';

  -- Verify no profiles exist
  ASSERT (SELECT COUNT(*) FROM public.profiles) = 0,
    'Profiles table should be empty';

  -- Verify no users exist
  ASSERT (SELECT COUNT(*) FROM auth.users) = 0,
    'Users table should be empty';

  RAISE NOTICE 'Database cleanup complete - all tables are empty';
END $$;