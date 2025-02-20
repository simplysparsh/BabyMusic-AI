/*
  # Remove preset songs functionality

  1. Changes
    - Remove preset-related columns and constraints
    - Clean up any existing preset songs
    - Ensure theme and mood constraints remain intact

  2. Notes
    - Preserves theme-based and custom song functionality
    - Maintains data integrity with existing constraints
*/

DO $$ 
BEGIN
  -- Remove any existing preset songs
  DELETE FROM songs 
  WHERE name ILIKE ANY(ARRAY['%playtime%', '%mealtime%', '%bedtime%', '%potty%']);

  -- Remove preset-related columns if they exist
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'preset_type'
  ) THEN
    ALTER TABLE songs DROP COLUMN preset_type;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'is_preset'
  ) THEN
    ALTER TABLE songs DROP COLUMN is_preset;
  END IF;

  -- Remove preset-related columns from profiles if they exist
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'preset_songs_generated'
  ) THEN
    ALTER TABLE profiles DROP COLUMN preset_songs_generated;
  END IF;
END $$;