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
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lyric_generation_errors' AND column_name = 'song_type'
  ) THEN
    ALTER TABLE lyric_generation_errors 
      ADD COLUMN song_type song_type;
  END IF;
END $$;

-- Update existing error records
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lyric_generation_errors' AND column_name = 'is_preset'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lyric_generation_errors' AND column_name = 'has_user_ideas'
  ) THEN
    UPDATE lyric_generation_errors
    SET song_type = CASE
      WHEN is_preset THEN 'preset'::song_type
      WHEN theme IS NOT NULL AND NOT has_user_ideas THEN 'theme'::song_type
      WHEN theme IS NOT NULL AND has_user_ideas THEN 'theme-with-input'::song_type
      ELSE 'from-scratch'::song_type
    END
    WHERE song_type IS NULL;
  END IF;
END $$;

-- Remove redundant columns from lyric_generation_errors
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lyric_generation_errors' AND column_name = 'is_preset'
  ) THEN
    ALTER TABLE lyric_generation_errors DROP COLUMN is_preset;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lyric_generation_errors' AND column_name = 'has_user_ideas'
  ) THEN
    ALTER TABLE lyric_generation_errors DROP COLUMN has_user_ideas;
  END IF;
END $$;

-- Remove redundant columns from songs
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'has_user_ideas'
  ) THEN
    ALTER TABLE songs DROP COLUMN has_user_ideas;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'is_preset'
  ) THEN
    ALTER TABLE songs DROP COLUMN is_preset;
  END IF;
END $$;

-- Add constraints to ensure data integrity
DO $$
BEGIN
  -- Add valid_song_type_theme constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_song_type_theme') THEN
    ALTER TABLE songs ADD CONSTRAINT valid_song_type_theme CHECK (
      (song_type IN ('theme', 'theme-with-input') AND theme IS NOT NULL) OR
      (song_type NOT IN ('theme', 'theme-with-input'))
    );
  END IF;
  
  -- Add valid_song_type_mood constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_song_type_mood') THEN
    ALTER TABLE songs ADD CONSTRAINT valid_song_type_mood CHECK (
      (song_type = 'from-scratch' AND mood IS NOT NULL) OR
      (song_type != 'from-scratch')
    );
  END IF;
END $$;

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Migration complete: Updated error logging and cleaned up redundant flags';
END $$;