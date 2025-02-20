/*
  # Restore preset song functionality
  
  1. Changes
    - Add preset_type column back to songs table
    - Add is_preset flag back to songs table
    - Add preset_songs_generated back to profiles table
    
  2. Notes
    - Maintains compatibility with theme-based approach
    - Allows tracking of preset song generation status
*/

DO $$ 
BEGIN
  -- Add preset_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'preset_type'
  ) THEN
    ALTER TABLE songs ADD COLUMN preset_type text;
  END IF;

  -- Add is_preset flag if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'is_preset'
  ) THEN
    ALTER TABLE songs ADD COLUMN is_preset boolean DEFAULT false;
  END IF;

  -- Add preset_songs_generated back to profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'preset_songs_generated'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preset_songs_generated boolean DEFAULT false;
  END IF;

  -- Add constraint for valid preset types
  ALTER TABLE songs DROP CONSTRAINT IF EXISTS valid_preset_type;
  ALTER TABLE songs ADD CONSTRAINT valid_preset_type 
    CHECK (
      preset_type IS NULL OR 
      preset_type IN ('playing', 'eating', 'sleeping', 'pooping')
    );
END $$;