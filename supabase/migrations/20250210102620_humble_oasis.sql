/*
  # Add error column to songs table

  1. Changes
    - Add `error` column to `songs` table to track generation errors
    - Make column nullable to only store errors when they occur
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'error'
  ) THEN
    ALTER TABLE songs ADD COLUMN error text;
  END IF;
END $$;