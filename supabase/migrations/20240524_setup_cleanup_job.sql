/*
  # Setup for cleanup-abandoned-signups function
  
  Note: This migration provides instructions for manually setting up the scheduled function
  because pg_cron extension is not enabled in the project.
*/

-- Instructions for setting up the scheduled function:
-- 1. Go to the Supabase Dashboard: https://supabase.com/dashboard/project/ustflrmqamppbghixjyl
-- 2. Navigate to "Edge Functions" in the sidebar
-- 3. Find the "cleanup-abandoned-signups" function
-- 4. Click on "Schedule" and set it to run every hour
--
-- Alternatively, you can enable the pg_cron extension by:
-- 1. Go to Database > Extensions
-- 2. Search for pg_cron
-- 3. Enable it
-- 4. Then run the following SQL in the SQL Editor:
/*
SELECT cron.schedule(
  'cleanup-abandoned-signups',  -- Job name
  '0 * * * *',                  -- Cron schedule (every hour)
  $$
  SELECT
    net.http_post(
      'https://ustflrmqamppbghixjyl.supabase.co/functions/v1/cleanup-abandoned-signups',
      '{}',  -- Empty JSON body
      ARRAY[
        ('Content-Type', 'application/json')::net.http_header
      ]
    );
  $$
);
*/

-- Add the is_onboarding column to profiles table if not already added
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'is_onboarding'
  ) THEN
    EXECUTE 'ALTER TABLE public.profiles ADD COLUMN is_onboarding BOOLEAN DEFAULT TRUE NOT NULL';
  END IF;
END $$; 