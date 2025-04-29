-- Add streak-related columns to profiles table idempotently

-- Add current_streak if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0 NULL;

-- Add last_active_date if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_active_date DATE NULL;

-- Add comments (COMMENT ON commands are idempotent)
COMMENT ON COLUMN public.profiles.current_streak IS 'User''s current daily activity streak count';
COMMENT ON COLUMN public.profiles.last_active_date IS 'The last date the user was considered active for streak purposes';

-- Optional: Add indexes idempotently if needed later
-- CREATE INDEX IF NOT EXISTS idx_profiles_current_streak ON public.profiles(current_streak);
-- CREATE INDEX IF NOT EXISTS idx_profiles_last_active_date ON public.profiles(last_active_date); 