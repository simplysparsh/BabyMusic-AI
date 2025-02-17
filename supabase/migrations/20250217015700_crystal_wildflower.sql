/*
  # Add pending status handling
  
  1. Changes
    - Add explicit pending status handling for songs in queue
    - Update existing songs to have correct pending status
    - Add status transition tracking
  
  2. Status Flow
    staged -> pending -> processing -> completed/failed
*/

-- Update songs that are queued but not yet processing
UPDATE songs
SET status = 'pending'
WHERE task_id IS NOT NULL 
  AND audio_url IS NULL 
  AND error IS NULL
  AND status NOT IN ('processing', 'completed', 'failed');

-- Update any staged songs that have task IDs to pending
UPDATE songs 
SET status = 'pending'
WHERE status = 'staged' 
  AND task_id IS NOT NULL;

-- Ensure songs without task IDs stay in staged state
UPDATE songs
SET status = 'staged'
WHERE task_id IS NULL 
  AND audio_url IS NULL
  AND error IS NULL;