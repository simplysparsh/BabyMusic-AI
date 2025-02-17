/*
  # Update song statuses

  1. Changes
    - Update all songs with audio_url to 'completed' status
    - Update all songs with error to 'failed' status
    - Set remaining songs to 'pending'
*/

-- Update song statuses based on their current state
UPDATE songs 
SET status = CASE
  WHEN audio_url IS NOT NULL THEN 'completed'::song_status
  WHEN error IS NOT NULL THEN 'failed'::song_status
  ELSE 'pending'::song_status
END
WHERE status IS NULL OR (status = 'pending' AND audio_url IS NOT NULL);

-- Set retryable flag for specific error messages
UPDATE songs
SET retryable = true
WHERE error LIKE '%credits%' OR error LIKE '%429%' OR error LIKE '%too many requests%';