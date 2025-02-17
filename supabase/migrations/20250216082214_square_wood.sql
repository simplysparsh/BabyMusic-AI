/*
  # Add cascade delete for user data

  1. Changes
    - Add ON DELETE CASCADE to profiles foreign key
    - Add ON DELETE CASCADE to songs foreign key
    - Add ON DELETE CASCADE to song_variations foreign key
  
  2. Security
    - Maintains RLS policies
    - Ensures data is properly cleaned up when a user is deleted
*/

-- Update profiles foreign key
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Update songs foreign key
ALTER TABLE songs
  DROP CONSTRAINT IF EXISTS songs_user_id_fkey,
  ADD CONSTRAINT songs_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Update song_variations foreign key
ALTER TABLE song_variations
  DROP CONSTRAINT IF EXISTS song_variations_song_id_fkey,
  ADD CONSTRAINT song_variations_song_id_fkey
    FOREIGN KEY (song_id)
    REFERENCES songs(id)
    ON DELETE CASCADE;