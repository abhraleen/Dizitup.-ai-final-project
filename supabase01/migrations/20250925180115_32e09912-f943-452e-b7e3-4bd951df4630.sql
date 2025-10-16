-- Add explicit access restrictions to user_roles table to prevent exposure of admin identities

-- Explicitly deny all access to anonymous users on user_roles table
CREATE POLICY "Deny all access to anonymous users on user roles" 
ON public.user_roles 
FOR ALL 
TO anon
USING (false);

-- Explicitly deny access to non-admin authenticated users on user_roles table
-- This prevents regular authenticated users from seeing who has admin privileges
CREATE POLICY "Deny access to non-admin authenticated users on user roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Ensure RLS is enabled on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;