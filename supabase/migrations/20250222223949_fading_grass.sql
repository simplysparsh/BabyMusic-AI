/*
  # Update error logging and cleanup redundant flags

  1. Changes
    - Update lyric_generation_errors table to use song_type enum
    - Remove redundant boolean flags from songs table
    - Add constraints to ensure data integrity

  2. Security
    - Maintain existing RLS policies
*/

-- Update lyric_generation_errors table
ALTER TABLE lyric_generation_errors 
  ADD COLUMN song_type song_type;

-- Update existing error records
UPDATE lyric_generation_errors
SET song_type = CASE
  WHEN is_preset THEN 'preset'::song_type
  WHEN theme IS NOT NULL AND NOT has_user_ideas THEN 'theme'::song_type
  WHEN theme IS NOT NULL AND has_user_ideas THEN 'theme-with-input'::song_type
  ELSE 'from-scratch'::song_type
END;

-- Remove redundant columns from lyric_generation_errors
ALTER TABLE lyric_generation_errors
  DROP COLUMN is_preset,
  DROP COLUMN has_user_ideas;

-- Remove redundant columns from songs
ALTER TABLE songs
  DROP COLUMN has_user_ideas,
  DROP COLUMN is_preset;

-- Add constraints to ensure data integrity
ALTER TABLE songs
  ADD CONSTRAINT valid_song_type_theme CHECK (
    (song_type IN ('theme', 'theme-with-input') AND theme IS NOT NULL) OR
    (song_type NOT IN ('theme', 'theme-with-input'))
  ),
  ADD CONSTRAINT valid_song_type_mood CHECK (
    (song_type = 'from-scratch' AND mood IS NOT NULL) OR
    (song_type != 'from-scratch')
  );

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Migration complete: Updated error logging and cleaned up redundant flags';
END $$;