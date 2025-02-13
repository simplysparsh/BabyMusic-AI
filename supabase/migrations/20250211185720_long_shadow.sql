/*
  # Add baby name to profiles

  1. Changes
    - Add baby_name column to profiles table
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'baby_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN baby_name text;
  END IF;
END $$;