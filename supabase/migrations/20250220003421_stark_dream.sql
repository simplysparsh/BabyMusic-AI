/*
  # Add theme support to songs table

  1. Changes
    - Add theme column to songs table
    - Make mood column nullable
    - Add check constraint for valid themes

  2. Notes
    - Theme-based songs don't require mood
    - Custom songs still require mood
*/

DO $$ 
BEGIN
  -- Add theme column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'theme'
  ) THEN
    ALTER TABLE songs ADD COLUMN theme text;

    -- Add check constraint for valid themes
    ALTER TABLE songs ADD CONSTRAINT valid_theme CHECK (
      theme IN (
        'pitchDevelopment',
        'cognitiveSpeech',
        'sleepRegulation',
        'socialEngagement',
        'musicalDevelopment',
        'indianClassical',
        'westernClassical',
        'custom'
      ) OR theme IS NULL
    );
  END IF;

  -- Make mood nullable
  ALTER TABLE songs ALTER COLUMN mood DROP NOT NULL;

  -- Add constraint to ensure either theme or mood is present
  ALTER TABLE songs ADD CONSTRAINT theme_or_mood_required 
    CHECK (
      (theme IS NOT NULL) OR 
      (mood IS NOT NULL)
    );

  -- Add constraint to ensure custom theme has mood
  ALTER TABLE songs ADD CONSTRAINT custom_theme_requires_mood
    CHECK (
      theme != 'custom' OR 
      (theme = 'custom' AND mood IS NOT NULL)
    );
END $$;