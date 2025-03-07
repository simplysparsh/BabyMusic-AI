/*
  # Add song type enum and update songs table

  1. Changes
    - Create song_type enum with values: 'preset', 'theme', 'theme-with-input', 'from-scratch'
    - Add song_type column to songs table
    - Update existing songs to set appropriate song_type based on current flags
    - Remove redundant boolean flags

  2. Rollback Plan
    - Keep has_user_ideas column temporarily for safe rollback if needed
*/

-- Create song_type enum
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'song_type'
  ) THEN
    CREATE TYPE song_type AS ENUM (
      'preset',
      'theme',
      'theme-with-input',
      'from-scratch'
    );
  END IF;
END $$;

-- Add song_type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'song_type'
  ) THEN
    ALTER TABLE songs ADD COLUMN song_type song_type;
    
    -- Update existing songs to set appropriate song_type
    UPDATE songs
    SET song_type = CASE
      WHEN is_preset THEN 'preset'::song_type
      WHEN theme IS NOT NULL AND NOT has_user_ideas THEN 'theme'::song_type
      WHEN theme IS NOT NULL AND has_user_ideas THEN 'theme-with-input'::song_type
      ELSE 'from-scratch'::song_type
    END;
    
    -- Make song_type NOT NULL after migration
    ALTER TABLE songs ALTER COLUMN song_type SET NOT NULL;
    
    -- Add index for performance if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE tablename = 'songs' AND indexname = 'idx_songs_song_type'
    ) THEN
      CREATE INDEX idx_songs_song_type ON songs(song_type);
    END IF;
  END IF;
END $$;

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Migration complete: Added song_type enum and updated songs table';
END $$;