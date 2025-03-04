/*
  # Database Schema Baseline
  
  This migration ensures that all tables are created with their current structure,
  without disrupting existing migrations. It uses IF NOT EXISTS clauses to ensure
  it works alongside other migrations.
  
  This file should be run in sequence with other migrations and does not require
  any special handling.
*/

-- Create enum types if they don't exist
DO $$ BEGIN
    -- song_type enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'song_type') THEN
        CREATE TYPE song_type AS ENUM ('LULLABY', 'NURSERY', 'CUSTOM');
    END IF;

    -- status enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN
        CREATE TYPE status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
    END IF;
END $$;

-- Create songs table if it doesn't exist
CREATE TABLE IF NOT EXISTS songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    mood TEXT,
    instrument TEXT,
    voice_type TEXT,
    lyrics TEXT,
    audio_url TEXT,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    error TEXT,
    task_id TEXT,
    preset_type TEXT,
    retryable BOOLEAN,
    theme TEXT,
    user_lyric_input TEXT,
    generated_lyrics TEXT,
    is_instrumental BOOLEAN,
    tempo TEXT,
    song_type song_type
);

-- Create song_variations table if it doesn't exist
CREATE TABLE IF NOT EXISTS song_variations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID REFERENCES songs(id),
    audio_url TEXT,
    title TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status status,
    retryable BOOLEAN
);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    email TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    daily_generations INTEGER DEFAULT 0,
    last_generation_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    baby_name TEXT,
    preset_songs_generated BOOLEAN DEFAULT FALSE,
    preferred_language TEXT DEFAULT 'en',
    birth_month INTEGER,
    birth_year INTEGER,
    age_group TEXT,
    gender TEXT
);

-- Handle gender column: Make it NOT NULL if it exists
DO $$ 
BEGIN
  -- Check if the column exists and is nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'gender' 
    AND is_nullable = 'YES'
  ) THEN
    -- First update any NULL values to 'other'
    EXECUTE 'UPDATE profiles SET gender = ''other'' WHERE gender IS NULL';
    -- Then make it NOT NULL
    EXECUTE 'ALTER TABLE profiles ALTER COLUMN gender SET NOT NULL';
  -- If the column doesn't exist yet, add it as NOT NULL with default
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'gender'
  ) THEN
    EXECUTE 'ALTER TABLE profiles ADD COLUMN gender TEXT NOT NULL DEFAULT ''other''';
  END IF;
  
  -- Add CHECK constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'profiles' AND constraint_name = 'gender_check'
  ) THEN
    EXECUTE 'ALTER TABLE profiles ADD CONSTRAINT gender_check CHECK (gender IN (''boy'', ''girl'', ''other''))';
  END IF;
END $$;

-- Create song_generations table if it doesn't exist
CREATE TABLE IF NOT EXISTS song_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID REFERENCES songs(id),
    status status,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lyric_generation_errors table if it doesn't exist
CREATE TABLE IF NOT EXISTS lyric_generation_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_message TEXT,
    theme TEXT,
    mood TEXT,
    preset_type TEXT,
    has_user_input BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    song_type song_type
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_songs_user_id ON songs(user_id);
CREATE INDEX IF NOT EXISTS idx_song_variations_song_id ON song_variations(song_id);
CREATE INDEX IF NOT EXISTS idx_song_generations_song_id ON song_generations(song_id); 