/*
  # Delete last 2 users and associated data

  1. Changes
    - Deletes the last 2 users created in the system
    - Cascades deletion to all associated data (profiles, songs, variations)
  
  2. Security
    - Uses row level security policies already in place
    - Maintains referential integrity through cascading deletes
*/

-- Get the IDs of the last 2 users created
WITH last_users AS (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 2
)
-- Delete the users (will cascade to profiles, songs, and variations)
DELETE FROM auth.users 
WHERE id IN (SELECT id FROM last_users);