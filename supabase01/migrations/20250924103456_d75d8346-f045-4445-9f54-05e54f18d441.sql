-- Update the request_status enum to include 'reviewed' and 'contacted' statuses
-- First, add the new enum values
ALTER TYPE request_status ADD VALUE 'reviewed';
ALTER TYPE request_status ADD VALUE 'contacted';