/*
  # Add webhook status logging

  1. Changes
    - Add logging function to track webhook status updates
    - Add trigger to log status changes
*/

-- Create a function to log status changes
CREATE OR REPLACE FUNCTION log_webhook_status()
RETURNS trigger AS $$
BEGIN
  -- Log status changes in a clear format
  RAISE NOTICE E'\n##### Status now: % ######\n', NEW.status;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS webhook_status_logger ON songs;
CREATE TRIGGER webhook_status_logger
  AFTER UPDATE OF status ON songs
  FOR EACH ROW
  EXECUTE FUNCTION log_webhook_status();