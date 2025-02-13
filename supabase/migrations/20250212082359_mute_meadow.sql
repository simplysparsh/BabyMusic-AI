/*
  # Delete all data and users
  
  1. Changes
    - Delete all data in the correct order to handle foreign key constraints
    - Delete all users from auth.users
    - Reset sequences
  
  2. Notes
    - Handles foreign key constraints properly
    - Safe to run multiple times
    - Cascading deletion through proper order
*/

-- First delete song variations (they depend on songs)
DELETE FROM public.song_variations;

-- Then delete songs (they depend on users)
DELETE FROM public.songs;

-- Then delete profiles (they depend on users)
DELETE FROM public.profiles;

-- Finally delete all users
DELETE FROM auth.users;

-- Reset sequences
ALTER SEQUENCE IF EXISTS auth.users_id_seq RESTART;