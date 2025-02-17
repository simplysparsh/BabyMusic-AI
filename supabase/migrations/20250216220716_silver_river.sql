/*
  # Add birth details to profiles

  1. Changes
    - Add birth_month column (integer, 1-12)
    - Add birth_year column (integer, >= 2020)
    - Add age_group column (text, with valid values)
    - Add constraints to ensure data validity
*/

DO $$ 
BEGIN
  -- Add birth_month if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'birth_month'
  ) THEN
    ALTER TABLE profiles ADD COLUMN birth_month integer CHECK (birth_month BETWEEN 1 AND 12);
  END IF;

  -- Add birth_year if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'birth_year'
  ) THEN
    ALTER TABLE profiles ADD COLUMN birth_year integer CHECK (birth_year >= 2020);
  END IF;

  -- Add age_group if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'age_group'
  ) THEN
    ALTER TABLE profiles ADD COLUMN age_group text CHECK (age_group IN ('0-6', '7-12', '13-24'));
  END IF;
END $$;