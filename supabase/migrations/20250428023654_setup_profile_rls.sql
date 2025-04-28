-- Setup RLS for public.profiles

-- Enable RLS (idempotent)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones (ensure clean slate)
-- You might need to run these manually if DROP IF EXISTS causes issues.
DROP POLICY IF EXISTS "Allow authenticated insert access" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated select access" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated update access" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

-- Create desired policies
CREATE POLICY "Allow authenticated select access" 
ON public.profiles FOR SELECT
TO authenticated USING ( auth.uid() = id );

CREATE POLICY "Allow authenticated insert access" 
ON public.profiles FOR INSERT
TO authenticated WITH CHECK ( auth.uid() = id );

CREATE POLICY "Allow authenticated update access" 
ON public.profiles FOR UPDATE
TO authenticated USING ( auth.uid() = id ) WITH CHECK ( auth.uid() = id );

-- Force RLS (idempotent)
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
