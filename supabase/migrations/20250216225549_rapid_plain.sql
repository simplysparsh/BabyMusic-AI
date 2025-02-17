/*
  # Add status tracking for song variations

  1. Changes
    - Add status column to song_variations table
    - Add retryable flag to song_variations table
    - Update existing variations with appropriate statuses
*/

DO $$ 
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'song_variations' AND column_name = 'status'
  ) THEN
    ALTER TABLE song_variations ADD COLUMN status song_status DEFAULT 'pending';
  END IF;

  -- Add retryable flag if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'song_variations' AND column_name = 'retryable'
  ) THEN
    ALTER TABLE song_variations ADD COLUMN retryable boolean DEFAULT false;
  END IF;

  -- Update existing variations
  UPDATE song_variations 
  SET status = CASE
    WHEN audio_url IS NOT NULL THEN 'completed'::song_status
    ELSE 'pending'::song_status
  END
  WHERE status IS NULL;
END $$;