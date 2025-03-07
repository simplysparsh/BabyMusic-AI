/*
  # Add voice settings to songs table
  
  1. New Columns
    - voice_type (text): Stores the selected voice type
    - tempo (text): Stores the tempo setting
  
  2. Changes
    - Add constraints for valid voice types and tempos
*/

DO $$ 
BEGIN
  -- Add voice_type if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'voice_type'
  ) THEN
    ALTER TABLE songs ADD COLUMN voice_type text;
    
    -- Add check constraint for valid voice types if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_voice_type') THEN
      ALTER TABLE songs ADD CONSTRAINT valid_voice_type 
        CHECK (voice_type IN ('softFemale', 'calmMale') OR voice_type IS NULL);
    END IF;
  END IF;

  -- Add tempo if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'tempo'
  ) THEN
    ALTER TABLE songs ADD COLUMN tempo text;
    
    -- Add check constraint for valid tempos if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_tempo') THEN
      ALTER TABLE songs ADD CONSTRAINT valid_tempo 
        CHECK (tempo IN ('slow', 'medium', 'fast') OR tempo IS NULL);
    END IF;
  END IF;
END $$;