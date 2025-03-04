# Cleanup Abandoned Signups Function

This Edge Function automatically cleans up abandoned sign-ups in the BabyMusic AI application.

## Purpose

The function performs the following tasks:
- Identifies user profiles that were created more than 24 hours ago but have not completed the sign-up process
- Deletes these incomplete profiles and their associated data
- Helps maintain database cleanliness and reduces storage costs

## Deployment

The function has been deployed to your Supabase project:
```bash
supabase functions deploy cleanup-abandoned-signups --project-ref ustflrmqamppbghixjyl --no-verify-jwt
```

## Scheduled Execution

A SQL migration file has been created to set up a scheduled job using `pg_cron`:
- File: `supabase/migrations/20240524_setup_cleanup_job.sql`
- Schedule: Runs hourly (at minute 0 of every hour)

To apply this migration, run:
```bash
supabase db push
```

## Manual Execution

You can also invoke the function manually:
```bash
curl -X POST https://ustflrmqamppbghixjyl.supabase.co/functions/v1/cleanup-abandoned-signups
```

## Environment Variables

The function uses environment variables that have been set from your local `.env.local` file:
```bash
supabase secrets set --env-file .env.local --project-ref ustflrmqamppbghixjyl
```

## Requirements

This function requires:
- Supabase project with Edge Functions enabled
- The `pg_cron` extension enabled for scheduled execution 