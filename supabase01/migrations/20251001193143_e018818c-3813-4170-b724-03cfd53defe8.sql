-- Update the user role to admin for acbd945@gmail.com
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = 'ef71297c-f5fc-4739-a768-b711e46fa904';