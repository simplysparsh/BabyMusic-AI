/*
  # Create songs table and related functionality

  1. New Tables
    - `songs`
      - `id` (uuid, primary key)
      - `name` (text)
      - `mood` (text)
      - `instrument` (text)
      - `voice_type` (text, nullable)
      - `lyrics` (text, nullable)
      - `audio_url` (text, nullable)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `songs` table
    - Add policies for authenticated users to manage their songs
*/

CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mood text NOT NULL,
  instrument text NOT NULL,
  voice_type text,
  lyrics text,
  audio_url text,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own songs
CREATE POLICY "Users can view own songs"
  ON songs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own songs
CREATE POLICY "Users can insert own songs"
  ON songs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own songs
CREATE POLICY "Users can update own songs"
  ON songs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own songs
CREATE POLICY "Users can delete own songs"
  ON songs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);