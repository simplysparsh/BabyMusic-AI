/*
  # Fix Profile Creation and Song Update Issues
  
  1. Changes
    - Recreate the missing trigger for automatic profile creation
    - Add fallback mechanisms for profile creation and song updates
    - Clean up existing data to start fresh
    - Add verification functions to prevent future issues
*/

-- First, clean up existing data (commented out for safety - uncomment if needed)
-- DELETE FROM songs;
-- DELETE FROM profiles;

-- Create the handle_new_user function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $func$
BEGIN
  INSERT INTO public.profiles (id, email, baby_name, preferred_language, created_at, preset_songs_generated)
  VALUES (
    new.id, 
    new.email, 
    SPLIT_PART(new.email, '@', 1), -- Default baby name from email
    'en', -- Default language
    NOW(),
    true
  );
  RETURN new;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger
DO $do_block$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created' 
    AND tgrelid = 'auth.users'::regclass
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END;
$do_block$;

-- Add a check function to verify the trigger is working
CREATE OR REPLACE FUNCTION check_profile_trigger_exists()
RETURNS boolean AS $func$
DECLARE
  trigger_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
    AND tgrelid = 'auth.users'::regclass
  ) INTO trigger_exists;
  
  RETURN trigger_exists;
END;
$func$ LANGUAGE plpgsql;

-- Create a function for fallback profile creation
CREATE OR REPLACE FUNCTION create_profile_fallback(
  user_id UUID,
  user_email TEXT,
  user_baby_name TEXT
) RETURNS VOID AS $func$
BEGIN
  -- Check if profile already exists
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
    -- Insert the profile
    INSERT INTO profiles (
      id, 
      email, 
      baby_name, 
      created_at, 
      preferred_language,
      preset_songs_generated
    ) VALUES (
      user_id,
      user_email,
      user_baby_name,
      NOW(),
      'en',
      true
    );
    
    -- Log the fallback creation
    RAISE NOTICE 'Created fallback profile for user %', user_id;
  ELSE
    RAISE NOTICE 'Profile already exists for user %', user_id;
  END IF;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to force update song audio
CREATE OR REPLACE FUNCTION force_update_song_audio(
  song_id UUID,
  audio_url TEXT
) RETURNS BOOLEAN AS $func$
DECLARE
  success BOOLEAN;
BEGIN
  -- Direct update using a different method
  UPDATE songs
  SET 
    audio_url = force_update_song_audio.audio_url,
    error = NULL,
    task_id = NULL,
    updated_at = NOW()
  WHERE id = song_id;
  
  -- Check if the update was successful
  SELECT EXISTS (
    SELECT 1 FROM songs WHERE id = song_id AND audio_url = force_update_song_audio.audio_url
  ) INTO success;
  
  -- Log the result
  IF success THEN
    RAISE NOTICE 'Successfully forced audio update for song %', song_id;
  ELSE
    RAISE NOTICE 'Failed to force audio update for song %', song_id;
  END IF;
  
  RETURN success;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a function to check for songs with missing audio URLs
CREATE OR REPLACE FUNCTION check_songs_with_missing_audio()
RETURNS TABLE (
  id UUID,
  name TEXT,
  task_id TEXT,
  created_at TIMESTAMPTZ,
  age_hours NUMERIC
) AS $func$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.task_id,
    s.created_at,
    EXTRACT(EPOCH FROM (NOW() - s.created_at))/3600 AS age_hours
  FROM songs s
  WHERE s.audio_url IS NULL
  AND s.created_at < NOW() - INTERVAL '1 hour'
  ORDER BY s.created_at DESC;
END;
$func$ LANGUAGE plpgsql; 