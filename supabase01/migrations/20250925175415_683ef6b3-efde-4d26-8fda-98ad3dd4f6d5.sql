-- Add more restrictive RLS policies for the profiles table to prevent unauthorized access

-- First, drop the existing policies to replace them with more secure ones
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create more restrictive policies that explicitly require authentication
-- and ensure only the profile owner can access their own data

-- Policy for viewing profiles - only authenticated users can view their own profile
CREATE POLICY "Authenticated users can view only their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Policy for updating profiles - only authenticated users can update their own profile
CREATE POLICY "Authenticated users can update only their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy for inserting profiles - only authenticated users can insert their own profile
CREATE POLICY "Authenticated users can insert only their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Explicitly deny all access to anonymous users
CREATE POLICY "Deny all access to anonymous users" 
ON public.profiles 
FOR ALL 
TO anon
USING (false);

-- Ensure RLS is enabled (should already be enabled but let's be explicit)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;