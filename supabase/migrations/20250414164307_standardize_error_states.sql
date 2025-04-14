-- Standardize error states in songs table
-- This ensures all error states are consistent with the new pattern

-- First, ensure all songs with errors have retryable set
UPDATE songs
SET retryable = true
WHERE error IS NOT NULL AND retryable IS NULL;

-- Clear task_id for all songs with errors (as per new pattern)
UPDATE songs
SET task_id = NULL
WHERE error IS NOT NULL AND task_id IS NOT NULL;

-- Set retryable to false for all completed songs
UPDATE songs
SET retryable = false
WHERE audio_url IS NOT NULL AND error IS NULL;

-- Add an index to improve performance of error-related queries (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_songs_error_state'
    ) THEN
        CREATE INDEX idx_songs_error_state 
        ON songs (error, retryable, task_id)
        WHERE error IS NOT NULL;
    END IF;
END $$; 