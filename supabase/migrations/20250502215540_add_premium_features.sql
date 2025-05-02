-- Add columns to profiles table for premium features and limits
-- Make sure to use IF NOT EXISTS for idempotency
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS generation_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_plays_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS play_count_reset_at TIMESTAMPTZ;

-- NOTE: is_premium column already exists.

-- Add is_favorite column to songs table
-- Make sure to use IF NOT EXISTS for idempotency
ALTER TABLE public.songs
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;

-- Optional: Consider adding NOT NULL constraints later if appropriate
-- ALTER TABLE public.profiles
-- ALTER COLUMN generation_count SET NOT NULL,
-- ALTER COLUMN monthly_plays_count SET NOT NULL;
-- ALTER TABLE public.songs
-- ALTER COLUMN is_favorite SET NOT NULL;
