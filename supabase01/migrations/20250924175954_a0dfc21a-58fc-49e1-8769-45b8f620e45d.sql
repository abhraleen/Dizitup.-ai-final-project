-- Add DELETE policy for admins on service_requests table
CREATE POLICY "Admins can delete service requests" 
ON public.service_requests 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));