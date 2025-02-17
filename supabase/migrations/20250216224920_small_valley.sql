/*
  # Add song status tracking

  1. New Columns
    - `status` - Track song generation status (pending/processing/completed/failed/staged)
    - `retryable` - Flag for retryable errors
  
  2. Changes
    - Add status column with valid states
    - Add retryable boolean flag
    - Add default status value
*/

DO $$ 
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'status'
  ) THEN
    -- Create enum type for status if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_type WHERE typname = 'song_status'
    ) THEN
      CREATE TYPE song_status AS ENUM (
        'pending',
        'processing',
        'completed',
        'failed',
        'staged'
      );
    END IF;

    ALTER TABLE songs ADD COLUMN status song_status DEFAULT 'pending';
  END IF;

  -- Add retryable flag if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'retryable'
  ) THEN
    ALTER TABLE songs ADD COLUMN retryable boolean DEFAULT false;
  END IF;

  -- Update existing songs without status
  UPDATE songs 
  SET status = CASE
    WHEN audio_url IS NOT NULL THEN 'completed'::song_status
    WHEN error IS NOT NULL THEN 'failed'::song_status
    ELSE 'pending'::song_status
  END
  WHERE status IS NULL;
END $$;