-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres user
GRANT USAGE ON SCHEMA cron TO postgres;

-- Set up the cleanup job
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