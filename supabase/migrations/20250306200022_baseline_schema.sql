/*
  # Baseline Schema
  
  This migration ensures the database has the correct schema structure for a fresh deployment.
  It creates all necessary tables, constraints, types, and functions if they don't already exist.
  All operations are idempotent, so this can be run on both new and existing databases.
  It also cleans up duplicate RLS policies and overrides any conflicting changes from previous migrations.
*/

-- First, drop all existing RLS policies to ensure clean slate
DO $$ 
BEGIN
  -- Drop all policies on profiles table
  DECLARE
    policy_name text;
  BEGIN
    FOR policy_name IN (
      SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
    ) LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', policy_name);
    END LOOP;
  END;

  -- Drop all policies on songs table
  DECLARE
    policy_name text;
  BEGIN
    FOR policy_name IN (
      SELECT policyname FROM pg_policies WHERE tablename = 'songs' AND schemaname = 'public'
    ) LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON songs', policy_name);
    END LOOP;
  END;

  -- Drop all policies on song_variations table
  DECLARE
    policy_name text;
  BEGIN
    FOR policy_name IN (
      SELECT policyname FROM pg_policies WHERE tablename = 'song_variations' AND schemaname = 'public'
    ) LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON song_variations', policy_name);
    END LOOP;
  END;

  -- Drop all policies on song_generations table
  DECLARE
    policy_name text;
  BEGIN
    FOR policy_name IN (
      SELECT policyname FROM pg_policies WHERE tablename = 'song_generations' AND schemaname = 'public'
    ) LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON song_generations', policy_name);
    END LOOP;
  END;

  -- Drop all policies on lyric_generation_errors table
  DECLARE
    policy_name text;
  BEGIN
    FOR policy_name IN (
      SELECT policyname FROM pg_policies WHERE tablename = 'lyric_generation_errors' AND schemaname = 'public'
    ) LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON lyric_generation_errors', policy_name);
    END LOOP;
  END;
END $$;

-- Create custom types if they don't exist
DO $$
BEGIN
  -- Create song_type enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'song_type') THEN
    CREATE TYPE song_type AS ENUM ('preset', 'theme', 'theme-with-input', 'from-scratch');
  END IF;
END $$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    is_premium boolean DEFAULT false,
    daily_generations integer DEFAULT 0,
    last_generation_date timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    baby_name text,
    preset_songs_generated boolean DEFAULT false,
    preferred_language text DEFAULT 'en'::text,
    birth_month integer,
    birth_year integer,
    age_group text,
    gender text
);

-- Add primary key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_pkey'
  ) THEN
    ALTER TABLE public.profiles ADD PRIMARY KEY (id);
  END IF;
END $$;

-- Add foreign key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_id_fkey'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add constraints to profiles table if they don't exist
DO $$
BEGIN
  -- Add gender_check constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gender_check') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT gender_check 
    CHECK (gender IS NULL OR gender IN ('boy', 'girl', 'other'));
  END IF;
  
  -- Add age_group_check constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_age_group_check') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_age_group_check 
    CHECK (age_group IN ('0-6', '7-12', '13-24'));
  END IF;
  
  -- Add birth_month_check constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_birth_month_check') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_birth_month_check 
    CHECK (birth_month >= 1 AND birth_month <= 12);
  END IF;
  
  -- Add birth_year_check constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_birth_year_check') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_birth_year_check 
    CHECK (birth_year >= 2020);
  END IF;
END $$;

-- Create songs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.songs (
    id uuid DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    name text,
    theme text,
    mood text,
    voice_type text,
    tempo text,
    song_type text,
    lyrics text,
    user_id uuid,
    status text DEFAULT 'generating'::text,
    audio_url text,
    user_lyric_input text,
    preset_type text,
    is_instrumental boolean DEFAULT false,
    retryable boolean DEFAULT true,
    error_message text,
    webhook_status text,
    webhook_received_at timestamptz,
    task_id text
);

-- Add primary key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'songs_pkey'
  ) THEN
    ALTER TABLE public.songs ADD PRIMARY KEY (id);
  END IF;
END $$;

-- Add NOT NULL constraints if they don't exist
DO $$
BEGIN
  -- Check if name column is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'songs' 
    AND column_name = 'name' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.songs ALTER COLUMN name SET NOT NULL;
  END IF;
  
  -- Check if song_type column is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'songs' 
    AND column_name = 'song_type' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.songs ALTER COLUMN song_type SET NOT NULL;
  END IF;
  
  -- Check if user_id column is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'songs' 
    AND column_name = 'user_id' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.songs ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- Add foreign key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'songs_user_id_fkey'
  ) THEN
    ALTER TABLE public.songs ADD CONSTRAINT songs_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add constraints to songs table if they don't exist
DO $$
BEGIN
  -- Add valid_tempo constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_tempo') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_tempo 
    CHECK (tempo IN ('slow', 'medium', 'fast') OR tempo IS NULL);
  END IF;
  
  -- Add valid_theme constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_theme') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_theme 
    CHECK (theme IN ('pitchDevelopment', 'cognitiveSpeech', 'sleepRegulation', 'socialEngagement', 'musicalDevelopment', 'indianClassical', 'westernClassical', 'custom') OR theme IS NULL);
  END IF;
  
  -- Add theme_or_mood_required constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'theme_or_mood_required') THEN
    ALTER TABLE public.songs ADD CONSTRAINT theme_or_mood_required 
    CHECK (theme IS NOT NULL OR mood IS NOT NULL);
  END IF;
  
  -- Add custom_theme_requires_mood constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'custom_theme_requires_mood') THEN
    ALTER TABLE public.songs ADD CONSTRAINT custom_theme_requires_mood 
    CHECK (theme <> 'custom' OR (theme = 'custom' AND mood IS NOT NULL));
  END IF;
  
  -- Add valid_song_type_theme constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_song_type_theme') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_song_type_theme 
    CHECK ((song_type::song_type IN ('theme', 'theme-with-input') AND theme IS NOT NULL) OR song_type::song_type NOT IN ('theme', 'theme-with-input'));
  END IF;
  
  -- Add valid_song_type_mood constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_song_type_mood') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_song_type_mood 
    CHECK ((song_type::song_type = 'from-scratch' AND mood IS NOT NULL) OR song_type::song_type <> 'from-scratch');
  END IF;
END $$;

-- Create song_variations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.song_variations (
    id uuid DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    song_id uuid,
    audio_url text,
    status text DEFAULT 'generating'::text,
    error_message text,
    webhook_status text,
    webhook_received_at timestamptz
);

-- Add primary key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'song_variations_pkey'
  ) THEN
    ALTER TABLE public.song_variations ADD PRIMARY KEY (id);
  END IF;
END $$;

-- Add NOT NULL constraints if they don't exist
DO $$
BEGIN
  -- Check if song_id column is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'song_variations' 
    AND column_name = 'song_id' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.song_variations ALTER COLUMN song_id SET NOT NULL;
  END IF;
END $$;

-- Add foreign key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'song_variations_song_id_fkey'
  ) THEN
    ALTER TABLE public.song_variations ADD CONSTRAINT song_variations_song_id_fkey 
    FOREIGN KEY (song_id) REFERENCES public.songs(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create song_generations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.song_generations (
    id uuid DEFAULT gen_random_uuid(),
    song_id uuid,
    status text DEFAULT 'pending'::text,
    started_at timestamptz,
    completed_at timestamptz,
    error text,
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

-- Add primary key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'song_generations_pkey'
  ) THEN
    ALTER TABLE public.song_generations ADD PRIMARY KEY (id);
  END IF;
END $$;

-- Add foreign key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'song_generations_song_id_fkey'
  ) THEN
    ALTER TABLE public.song_generations ADD CONSTRAINT song_generations_song_id_fkey 
    FOREIGN KEY (song_id) REFERENCES public.songs(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create lyric_generation_errors table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.lyric_generation_errors (
    id uuid DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    error_message text,
    theme text,
    mood text,
    preset_type text,
    song_type song_type
);

-- Add primary key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lyric_generation_errors_pkey'
  ) THEN
    ALTER TABLE public.lyric_generation_errors ADD PRIMARY KEY (id);
  END IF;
END $$;

-- Add song_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lyric_generation_errors' AND column_name = 'song_id'
  ) THEN
    ALTER TABLE public.lyric_generation_errors ADD COLUMN song_id uuid;
  END IF;
END $$;

-- Add foreign key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lyric_generation_errors_song_id_fkey'
  ) THEN
    ALTER TABLE public.lyric_generation_errors ADD CONSTRAINT lyric_generation_errors_song_id_fkey 
    FOREIGN KEY (song_id) REFERENCES public.songs(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create log_webhook_status function if it doesn't exist
CREATE OR REPLACE FUNCTION public.log_webhook_status()
RETURNS trigger AS $$
BEGIN
  -- Log status changes in a clear format
  RAISE NOTICE E'\n##### Status now: % ######\n', NEW.status;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create handle_user_deletion function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_user_deletion()
RETURNS trigger AS $$
BEGIN
  -- Delete profile (which will cascade to songs and variations)
  DELETE FROM public.profiles WHERE id = old.id;
  RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create handle_new_user function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create webhook_status_logger trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'webhook_status_logger'
  ) THEN
    CREATE TRIGGER webhook_status_logger
    BEFORE UPDATE ON public.songs
    FOR EACH ROW
    EXECUTE FUNCTION public.log_webhook_status();
  END IF;
END $$;

-- Create on_auth_user_created trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Create on_auth_user_deleted trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_deleted'
  ) THEN
    CREATE TRIGGER on_auth_user_deleted
    AFTER DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_deletion();
  END IF;
END $$;

-- Create consistent RLS policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Create consistent RLS policies for songs table
CREATE POLICY "Users can view their own songs" 
ON songs FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own songs" 
ON songs FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own songs" 
ON songs FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own songs" 
ON songs FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create RLS policies for song_variations table
CREATE POLICY "Users can view their own song variations" 
ON song_variations FOR SELECT 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own song variations" 
ON song_variations FOR INSERT 
TO authenticated
WITH CHECK (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own song variations" 
ON song_variations FOR UPDATE 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()))
WITH CHECK (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own song variations" 
ON song_variations FOR DELETE 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

-- Create RLS policies for song_generations table
CREATE POLICY "Users can view their own song generations" 
ON song_generations FOR SELECT 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own song generations" 
ON song_generations FOR INSERT 
TO authenticated
WITH CHECK (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own song generations" 
ON song_generations FOR UPDATE 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()))
WITH CHECK (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own song generations" 
ON song_generations FOR DELETE 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

-- Create RLS policies for lyric_generation_errors table
CREATE POLICY "Users can view their own lyric generation errors" 
ON lyric_generation_errors FOR SELECT 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own lyric generation errors" 
ON lyric_generation_errors FOR INSERT 
TO authenticated
WITH CHECK (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own lyric generation errors" 
ON lyric_generation_errors FOR DELETE 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lyric_generation_errors ENABLE ROW LEVEL SECURITY; 