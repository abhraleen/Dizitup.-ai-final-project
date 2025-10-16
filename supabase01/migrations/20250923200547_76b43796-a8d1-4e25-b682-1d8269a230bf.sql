-- Update the existing user to have admin role instead of user role
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = '9f010d64-38dc-48cb-b2fe-20cb2463e6c0' AND role = 'user';