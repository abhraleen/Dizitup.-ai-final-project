-- Add explicit deny policy for anonymous users on service_requests table
-- to prevent any potential unauthorized access to sensitive customer data

-- Explicitly deny all access to anonymous users for service_requests table
CREATE POLICY "Deny all access to anonymous users on service requests" 
ON public.service_requests 
FOR ALL 
TO anon
USING (false);

-- Also ensure that authenticated users who are not admins cannot view service requests
-- (This adds an extra layer of security beyond the existing admin-only policy)
CREATE POLICY "Deny SELECT access to non-admin authenticated users" 
ON public.service_requests 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure RLS is enabled on service_requests table
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;