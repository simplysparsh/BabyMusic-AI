/*
  # Add generation history tracking
  
  1. New Table
    - song_generations: Tracks each generation attempt
      - id (uuid)
      - song_id (uuid)
      - status (song_status)
      - started_at (timestamptz)
      - completed_at (timestamptz)
      - error (text)
      - metadata (jsonb)
  
  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Create song_generations table
CREATE TABLE IF NOT EXISTS song_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id uuid REFERENCES songs ON DELETE CASCADE,
  status song_status NOT NULL DEFAULT 'pending',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  error text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE song_generations ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own song generations"
  ON song_generations
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM songs
    WHERE songs.id = song_generations.song_id
    AND songs.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own song generations"
  ON song_generations
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM songs
    WHERE songs.id = song_generations.song_id
    AND songs.user_id = auth.uid()
  ));