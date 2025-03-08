-- Drop the song_state_logs table and its related triggers/functions
DROP TABLE IF EXISTS song_state_logs;
DROP TRIGGER IF EXISTS webhook_status_logger ON songs;
DROP FUNCTION IF EXISTS log_status_changes();

-- Remove status columns from song_variations and song_generations tables
ALTER TABLE song_variations DROP COLUMN IF EXISTS status;
ALTER TABLE song_generations DROP COLUMN IF EXISTS status;

-- Add a comment to the songs table to document the state model
COMMENT ON TABLE songs IS 'Songs table with state determined by SongStateService based on task_id, audio_url, and error fields:
- Generating: has task_id, no audio_url, no error
- Completed: has audio_url
- Failed: has error';
