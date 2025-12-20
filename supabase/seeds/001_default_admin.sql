-- Create a default admin user
-- Note: In a production environment, you would create this user through the signup process
-- and then manually update the role to 'admin' in the database
-- For development/testing purposes, we're inserting a default admin user

-- IMPORTANT: This is for development/testing only. In production, you should:
-- 1. Create a user through the signup process
-- 2. Manually update their role to 'admin' in the database
-- 3. Or create a secure admin invitation system

INSERT INTO users (id, email, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'Default Admin', 'admin');