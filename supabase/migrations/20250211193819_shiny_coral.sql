/*
  # Add language preference to profiles

  1. Changes
    - Add preferred_language column to profiles table with default 'English'
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'preferred_language'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preferred_language text DEFAULT 'English';
  END IF;
END $$;