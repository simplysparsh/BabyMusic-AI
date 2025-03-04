/*
  # Add is_onboarding flag to profiles

  1. Changes
    - Add is_onboarding column to profiles table to track incomplete sign-ups
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_onboarding'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_onboarding boolean DEFAULT false;
  END IF;
END $$; 