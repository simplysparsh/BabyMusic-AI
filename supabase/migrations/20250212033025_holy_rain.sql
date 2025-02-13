/*
  # Remove preset_songs table and update songs tracking

  1. Changes
    - Drop preset_songs table as configurations are now in code
    - Add preset_type column to songs table for better tracking
    - Add is_preset boolean flag to songs table
  
  2. Security
    - Maintain existing RLS policies
*/

-- Drop the preset_songs table as it's no longer needed
DROP TABLE IF EXISTS preset_songs;

-- Add tracking columns to songs table
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
END $$;