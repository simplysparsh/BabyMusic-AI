/*
  # Make Gender Mandatory in Profiles Table

  1. Changes
    - Update existing NULL gender values to 'other'
    - Make gender column NOT NULL
  
  2. Reason
    - Gender is required for proper pronoun usage in song lyrics
*/

-- First, set all NULL values to 'other' as the default
UPDATE profiles
SET gender = 'other'
WHERE gender IS NULL;

-- Then, alter the column to NOT NULL
ALTER TABLE profiles
ALTER COLUMN gender SET NOT NULL;
