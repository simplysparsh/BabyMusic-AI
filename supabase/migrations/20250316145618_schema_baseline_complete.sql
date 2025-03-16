/*
  # Complete Schema Baseline

  This is a comprehensive baseline of the entire database schema.
  It creates all tables, functions, triggers, and types from scratch.
  
  Use this file as the source of truth for the database schema.
  
  All statements are idempotent (using IF EXISTS/IF NOT EXISTS) to ensure
  safe execution in any environment.
*/

-- ==============================================================
-- PART 1: DROP ALL EXISTING TRIGGERS AND FUNCTIONS
-- Make sure to drop dependent objects before their parents
-- ==============================================================

-- Drop all triggers first (they depend on functions)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- Drop all functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS handle_user_deletion();
DROP FUNCTION IF EXISTS check_profile_trigger_exists();
DROP FUNCTION IF EXISTS create_profile_fallback(UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS force_update_song_audio(UUID, TEXT);
DROP FUNCTION IF EXISTS check_songs_with_missing_audio();

-- ==============================================================
-- PART 2: RECREATE TYPE DEFINITIONS
-- ==============================================================

-- Recreate song_type enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'song_type') THEN
    CREATE TYPE song_type AS ENUM ('preset', 'theme', 'theme-with-input', 'from-scratch');
  END IF;
END $$;

-- ==============================================================
-- PART 3: CREATE OR REPLACE FUNCTIONS
-- ==============================================================

-- Create the handle_new_user function
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

-- Create the handle_user_deletion function
CREATE OR REPLACE FUNCTION handle_user_deletion()
RETURNS trigger AS $$
BEGIN
  -- Delete profile (which will cascade to songs and variations)
  DELETE FROM public.profiles WHERE id = old.id;
  RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create check_profile_trigger_exists function
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

-- Create profile fallback function
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

-- Create function to force update song audio
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

-- ==============================================================
-- PART 4: CREATE TABLES
-- ==============================================================

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  baby_name text,
  birth_month integer,
  birth_year integer,
  age_group text,
  gender text,
  preferred_language text DEFAULT 'en'::text,
  created_at timestamptz DEFAULT now(),
  preset_songs_generated boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  daily_generations integer DEFAULT 0,
  last_generation_date timestamptz
);

COMMENT ON TABLE public.profiles IS 'User profiles containing baby information and preferences';

-- Create songs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  theme text,
  mood text,
  voice_type text,
  tempo text,
  song_type song_type NOT NULL,
  lyrics text,
  audio_url text,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_lyric_input text,
  preset_type text,
  is_instrumental boolean DEFAULT false,
  retryable boolean DEFAULT false,
  error text,
  task_id text,
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.songs IS 'Songs table with state determined by SongStateService based on task_id, audio_url, and error fields:
- Generating: has task_id, no audio_url, no error
- Completed: has audio_url
- Failed: has error';

-- Create song_variations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.song_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id uuid NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  audio_url text,
  title text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  retryable boolean DEFAULT false
);

COMMENT ON TABLE public.song_variations IS 'Variations of songs with different audio renditions';

-- Create lyric_generation_errors table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.lyric_generation_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message text NOT NULL,
  theme text,
  mood text,
  preset_type text,
  has_user_input boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  song_id uuid REFERENCES public.songs(id) ON DELETE CASCADE,
  song_type song_type
);

COMMENT ON TABLE public.lyric_generation_errors IS 'Logs of errors that occur during lyric generation';

-- ==============================================================
-- PART 5: CREATE CONSTRAINTS AND INDEXES
-- ==============================================================

-- Add constraints to songs table if they don't exist
DO $$
BEGIN
  -- Valid tempo constraint
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_tempo') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_tempo
    CHECK (tempo IS NULL OR tempo IN ('slow', 'medium', 'fast'));
  END IF;

  -- Valid theme constraint  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_theme') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_theme
    CHECK (theme IS NULL OR theme IN ('pitchDevelopment', 'cognitiveSpeech', 'sleepRegulation', 'socialEngagement', 'indianClassical', 'westernClassical'));
  END IF;

  -- Theme or mood required constraint
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'theme_or_mood_required') THEN
    ALTER TABLE public.songs ADD CONSTRAINT theme_or_mood_required
    CHECK (
      (song_type IN ('preset', 'theme', 'theme-with-input') AND (theme IS NOT NULL OR mood IS NOT NULL)) OR
      (song_type = 'from-scratch')
    );
  END IF;

  -- Custom theme requires mood constraint
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'custom_theme_requires_mood') THEN
    ALTER TABLE public.songs ADD CONSTRAINT custom_theme_requires_mood
    CHECK (
      (theme IS NULL) OR (theme IS NOT NULL AND mood IS NOT NULL)
    );
  END IF;

  -- Valid song type theme constraint
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_song_type_theme') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_song_type_theme
    CHECK (
      (song_type != 'theme' AND song_type != 'theme-with-input') OR
      (song_type IN ('theme', 'theme-with-input') AND theme IS NOT NULL)
    );
  END IF;

  -- Valid song type mood constraint
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_song_type_mood') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_song_type_mood
    CHECK (
      (song_type != 'from-scratch') OR
      (song_type = 'from-scratch' AND mood IS NOT NULL)
    );
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'songs' AND indexname = 'idx_songs_user_id'
  ) THEN
    CREATE INDEX idx_songs_user_id ON songs(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'songs' AND indexname = 'idx_songs_song_type'
  ) THEN
    CREATE INDEX idx_songs_song_type ON songs(song_type);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'song_variations' AND indexname = 'idx_song_variations_song_id'
  ) THEN
    CREATE INDEX idx_song_variations_song_id ON song_variations(song_id);
  END IF;
END $$;

-- ==============================================================
-- PART 6: CREATE TRIGGERS
-- ==============================================================

-- Create triggers if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_deleted'
  ) THEN
    CREATE TRIGGER on_auth_user_deleted
    AFTER DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_user_deletion();
  END IF;
END $$;

-- ==============================================================
-- PART 7: ENABLE ROW LEVEL SECURITY
-- ==============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lyric_generation_errors ENABLE ROW LEVEL SECURITY;

-- ==============================================================
-- PART 8: CREATE RLS POLICIES
-- ==============================================================

-- Create RLS policies for profiles table
DO $$
BEGIN
  -- SELECT policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_select_policy') THEN
    CREATE POLICY profiles_select_policy ON profiles
    FOR SELECT USING (
      auth.uid() = id
    );
  END IF;

  -- INSERT policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_insert_policy') THEN
    CREATE POLICY profiles_insert_policy ON profiles
    FOR INSERT WITH CHECK (
      auth.uid() = id
    );
  END IF;
  
  -- UPDATE policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_update_policy') THEN
    CREATE POLICY profiles_update_policy ON profiles
    FOR UPDATE USING (
      auth.uid() = id
    );
  END IF;
  
  -- DELETE policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_delete_policy') THEN
    CREATE POLICY profiles_delete_policy ON profiles
    FOR DELETE USING (
      auth.uid() = id
    );
  END IF;
END $$;

-- Create RLS policies for songs table
DO $$
BEGIN
  -- SELECT policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'songs' AND policyname = 'songs_select_policy') THEN
    CREATE POLICY songs_select_policy ON songs
    FOR SELECT USING (
      auth.uid() = user_id
    );
  END IF;

  -- INSERT policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'songs' AND policyname = 'songs_insert_policy') THEN
    CREATE POLICY songs_insert_policy ON songs
    FOR INSERT WITH CHECK (
      auth.uid() = user_id
    );
  END IF;
  
  -- UPDATE policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'songs' AND policyname = 'songs_update_policy') THEN
    CREATE POLICY songs_update_policy ON songs
    FOR UPDATE USING (
      auth.uid() = user_id
    );
  END IF;
  
  -- DELETE policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'songs' AND policyname = 'songs_delete_policy') THEN
    CREATE POLICY songs_delete_policy ON songs
    FOR DELETE USING (
      auth.uid() = user_id
    );
  END IF;
END $$;

-- Create RLS policies for song_variations table
DO $$
BEGIN
  -- SELECT policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'song_variations' AND policyname = 'song_variations_select_policy') THEN
    CREATE POLICY song_variations_select_policy ON song_variations
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM songs
        WHERE songs.id = song_variations.song_id
        AND songs.user_id = auth.uid()
      )
    );
  END IF;

  -- INSERT policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'song_variations' AND policyname = 'song_variations_insert_policy') THEN
    CREATE POLICY song_variations_insert_policy ON song_variations
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM songs
        WHERE songs.id = song_variations.song_id
        AND songs.user_id = auth.uid()
      )
    );
  END IF;
  
  -- UPDATE policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'song_variations' AND policyname = 'song_variations_update_policy') THEN
    CREATE POLICY song_variations_update_policy ON song_variations
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM songs
        WHERE songs.id = song_variations.song_id
        AND songs.user_id = auth.uid()
      )
    );
  END IF;
  
  -- DELETE policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'song_variations' AND policyname = 'song_variations_delete_policy') THEN
    CREATE POLICY song_variations_delete_policy ON song_variations
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM songs
        WHERE songs.id = song_variations.song_id
        AND songs.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Create RLS policies for lyric_generation_errors table
DO $$
BEGIN
  -- Admin-only SELECT policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lyric_generation_errors' AND policyname = 'lyric_generation_errors_select_policy') THEN
    CREATE POLICY lyric_generation_errors_select_policy ON lyric_generation_errors
    FOR SELECT USING (
      auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );
  END IF;

  -- INSERT policy - anyone can insert errors
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lyric_generation_errors' AND policyname = 'lyric_generation_errors_insert_policy') THEN
    CREATE POLICY lyric_generation_errors_insert_policy ON lyric_generation_errors
    FOR INSERT WITH CHECK (true);
  END IF;
  
  -- Admin-only DELETE policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lyric_generation_errors' AND policyname = 'lyric_generation_errors_delete_policy') THEN
    CREATE POLICY lyric_generation_errors_delete_policy ON lyric_generation_errors
    FOR DELETE USING (
      auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );
  END IF;
END $$; 