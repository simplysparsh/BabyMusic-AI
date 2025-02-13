/*
  # Add task_id column to songs table

  1. Changes
    - Add task_id column to songs table for webhook correlation
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'task_id'
  ) THEN
    ALTER TABLE songs ADD COLUMN task_id text;
  END IF;
END $$;