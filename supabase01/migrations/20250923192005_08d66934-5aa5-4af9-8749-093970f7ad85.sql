-- Fix search path for generate_enquiry_number function
CREATE OR REPLACE FUNCTION public.generate_enquiry_number()
RETURNS TEXT
LANGUAGE SQL
STABLE
SET search_path = public
AS $$
  SELECT 'ENQ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((RANDOM() * 9999)::INT::TEXT, 4, '0');
$$;

-- Fix search path for set_enquiry_number function
CREATE OR REPLACE FUNCTION public.set_enquiry_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.enquiry_number IS NULL OR NEW.enquiry_number = '' THEN
    NEW.enquiry_number := public.generate_enquiry_number();
  END IF;
  RETURN NEW;
END;
$$;