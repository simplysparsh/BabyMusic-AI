/*
  # Fix instrument constraint

  1. Changes
    - Make instrument column nullable in songs table
    - Add default instrument for existing rows
*/

-- First set a default instrument for any existing rows
UPDATE songs 
SET instrument = 'piano' 
WHERE instrument IS NULL;

-- Then make the column nullable
ALTER TABLE songs 
ALTER COLUMN instrument DROP NOT NULL;