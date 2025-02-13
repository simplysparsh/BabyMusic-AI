/*
  # Add preset songs table

  1. New Tables
    - `preset_songs`
      - `id` (uuid, primary key)
      - `type` (text) - Type of preset (playing, eating, sleeping, pooping)
      - `lyrics_template` (text) - Template with {name} placeholder
      - `mood` (text)
      - `instrument` (text)
      - `voice_type` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on preset_songs table
    - Add policy for authenticated users to read presets
*/

CREATE TABLE IF NOT EXISTS preset_songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  lyrics_template text NOT NULL,
  mood text NOT NULL,
  instrument text NOT NULL,
  voice_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE preset_songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read preset songs"
  ON preset_songs FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial preset songs
INSERT INTO preset_songs (type, lyrics_template, mood, instrument, voice_type) VALUES
  ('playing', 'Bounce and play, {name}''s having fun today! Jump and spin, let the games begin! {name}''s smile lights up the way, as we play all through the day!', 'playful', 'piano', 'softFemale'),
  ('eating', 'Yummy yummy in {name}''s tummy, eating food that''s oh so yummy! Open wide, food inside, growing strong with every bite!', 'calm', 'harp', 'softFemale'),
  ('sleeping', 'Sweet dreams little {name}, close your eyes and drift away. Stars are twinkling up above, wrapped in warmth and endless love.', 'calm', 'strings', 'softFemale'),
  ('pooping', 'Push push little {name}, let it all come out to play! Every day we do our part, making pooping into art!', 'playful', 'piano', 'softFemale');