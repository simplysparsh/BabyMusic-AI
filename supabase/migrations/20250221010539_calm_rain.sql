/*
  # Add Lyric Generation Support

  1. New Columns
    - `has_user_ideas` (boolean): Tracks if user provided custom lyric ideas
    - `user_lyric_input` (text): Stores the user's original lyric input/ideas
    - `generated_lyrics` (text): Stores the AI-generated lyrics
    - `is_instrumental` (boolean): Indicates if the song is instrumental

  2. Changes
    - Make `lyrics` column nullable since instrumental songs won't have lyrics
    - Add default values for new boolean columns
*/

DO $$ 
BEGIN
  -- Add has_user_ideas if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'has_user_ideas'
  ) THEN
    ALTER TABLE songs ADD COLUMN has_user_ideas boolean DEFAULT false;
  END IF;

  -- Add user_lyric_input if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'user_lyric_input'
  ) THEN
    ALTER TABLE songs ADD COLUMN user_lyric_input text;
  END IF;

  -- Add generated_lyrics if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'generated_lyrics'
  ) THEN
    ALTER TABLE songs ADD COLUMN generated_lyrics text;
  END IF;

  -- Add is_instrumental if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'is_instrumental'
  ) THEN
    ALTER TABLE songs ADD COLUMN is_instrumental boolean DEFAULT false;
  END IF;

  -- Make lyrics column nullable
  ALTER TABLE songs ALTER COLUMN lyrics DROP NOT NULL;
END $$;