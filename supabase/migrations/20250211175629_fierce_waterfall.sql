/*
  # Add cascade delete for song variations

  1. Changes
    - Add ON DELETE CASCADE to song_variations foreign key
    - This ensures variations are automatically deleted when a song is deleted

  2. Security
    - Maintains existing RLS policies
    - Safe operation as variations should not exist without parent songs
*/

-- Drop existing foreign key constraint
ALTER TABLE song_variations 
  DROP CONSTRAINT IF EXISTS song_variations_song_id_fkey;

-- Re-add with cascade delete
ALTER TABLE song_variations 
  ADD CONSTRAINT song_variations_song_id_fkey 
  FOREIGN KEY (song_id) 
  REFERENCES songs(id) 
  ON DELETE CASCADE;