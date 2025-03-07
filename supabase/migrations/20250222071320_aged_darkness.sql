/*
  # Create lyric generation errors table

  1. New Tables
    - `lyric_generation_errors`
      - `id` (uuid, primary key)
      - `error_message` (text)
      - `theme` (text, nullable)
      - `mood` (text, nullable)
      - `is_preset` (boolean)
      - `preset_type` (text, nullable)
      - `has_user_ideas` (boolean)
      - `has_user_input` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policy for authenticated users to insert errors
*/

-- Create the lyric generation errors table
CREATE TABLE IF NOT EXISTS lyric_generation_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message text NOT NULL,
  theme text,
  mood text,
  is_preset boolean DEFAULT false,
  preset_type text,
  has_user_ideas boolean DEFAULT false,
  has_user_input boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lyric_generation_errors ENABLE ROW LEVEL SECURITY;

-- Add policies if they don't exist
DO $$
BEGIN
  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lyric_generation_errors' 
    AND policyname = 'Users can insert lyric generation errors'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert lyric generation errors"
      ON lyric_generation_errors
      FOR INSERT
      TO authenticated
      WITH CHECK (true)';
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lyric_generation_errors' 
    AND policyname = 'Users can view lyric generation errors'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view lyric generation errors"
      ON lyric_generation_errors
      FOR SELECT
      TO authenticated
      USING (true)';
  END IF;
END $$;