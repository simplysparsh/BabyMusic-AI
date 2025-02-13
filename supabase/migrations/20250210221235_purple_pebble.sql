/*
  # Add support for song variations

  1. New Tables
    - `song_variations`
      - `id` (uuid, primary key)
      - `song_id` (uuid, references songs)
      - `audio_url` (text)
      - `title` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `song_variations` table
    - Add policies for authenticated users to manage their variations
*/

CREATE TABLE IF NOT EXISTS song_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id uuid REFERENCES songs NOT NULL,
  audio_url text NOT NULL,
  title text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE song_variations ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own song variations
CREATE POLICY "Users can view own song variations"
  ON song_variations
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM songs
    WHERE songs.id = song_variations.song_id
    AND songs.user_id = auth.uid()
  ));

-- Allow users to insert variations for their own songs
CREATE POLICY "Users can insert own song variations"
  ON song_variations
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM songs
    WHERE songs.id = song_variations.song_id
    AND songs.user_id = auth.uid()
  ));

-- Allow users to update their own song variations
CREATE POLICY "Users can update own song variations"
  ON song_variations
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM songs
    WHERE songs.id = song_variations.song_id
    AND songs.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM songs
    WHERE songs.id = song_variations.song_id
    AND songs.user_id = auth.uid()
  ));