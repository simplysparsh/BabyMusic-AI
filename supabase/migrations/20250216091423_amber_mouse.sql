/*
  # Add Baby Profile Fields

  1. Changes
    - Add birth_month and birth_year columns to profiles table
    - Add age_group column to profiles table
    - Update existing profiles with default values
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to profiles table
DO $$ 
BEGIN
  -- Add birth_month if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'birth_month'
  ) THEN
    ALTER TABLE profiles ADD COLUMN birth_month integer;
  END IF;

  -- Add birth_year if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'birth_year'
  ) THEN
    ALTER TABLE profiles ADD COLUMN birth_year integer;
  END IF;

  -- Add age_group if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'age_group'
  ) THEN
    ALTER TABLE profiles ADD COLUMN age_group text;
  END IF;
END $$;