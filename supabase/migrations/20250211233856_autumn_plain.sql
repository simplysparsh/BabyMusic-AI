/*
  # User Cleanup Migration

  1. Changes
    - Add function to clean up user data when deleting from auth.users
    - Add trigger to automatically run cleanup when a user is deleted
    
  2. Security
    - Function runs with security definer to ensure proper permissions
    - Cascading deletes handle related records
*/

-- Function to clean up user data when a user is deleted
CREATE OR REPLACE FUNCTION handle_user_deletion()
RETURNS trigger AS $$
BEGIN
  -- Delete profile (which will cascade to songs and variations)
  DELETE FROM public.profiles WHERE id = old.id;
  RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run cleanup when a user is deleted
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_deletion();