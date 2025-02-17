/*
  # Add Baby Profile Columns

  1. New Columns
    - `birth_month` (integer) - Baby's birth month
    - `birth_year` (integer) - Baby's birth year
    - `age_group` (text) - Age group category (0-6, 7-12, 13-24 months)

  2. Changes
    - Adds new columns to profiles table for tracking baby age information
    - Includes validation for month and year values
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