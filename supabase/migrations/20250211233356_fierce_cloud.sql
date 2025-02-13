/*
  # Update preset songs structure and data
  
  1. Changes
    - Make instrument column nullable
    - Update preset songs with new configuration
    - Remove instrument requirement
    - Update mood settings
  
  2. Security
    - Maintains existing RLS policies
*/

-- First, modify the table structure to make instrument nullable
ALTER TABLE preset_songs ALTER COLUMN instrument DROP NOT NULL;

-- Clear existing preset songs
TRUNCATE TABLE preset_songs;

-- Insert updated preset songs without instrument requirement
INSERT INTO preset_songs (type, lyrics_template, mood, voice_type) VALUES
  (
    'playing',
    'Bounce and play, {name}''s having fun today! Jump and spin, let the games begin!',
    'energetic',
    'softFemale'
  ),
  (
    'eating',
    'Yummy yummy in {name}''s tummy, eating food that''s oh so yummy!',
    'playful',
    'softFemale'
  ),
  (
    'sleeping',
    'Sweet dreams little {name}, close your eyes and drift away.',
    'calm',
    'softFemale'
  ),
  (
    'pooping',
    'Push push little {name}, let it all come out to play!',
    'playful',
    'softFemale'
  );