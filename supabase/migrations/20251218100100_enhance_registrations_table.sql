-- Enhance registrations table with better constraints and indexes
-- Add validation constraints for required fields
-- Add more specific indexes for better query performance

-- Add check constraints for required fields
ALTER TABLE registrations 
ADD CONSTRAINT check_full_name_not_empty CHECK (LENGTH(TRIM(full_name)) > 0);

ALTER TABLE registrations 
ADD CONSTRAINT check_email_not_empty CHECK (LENGTH(TRIM(email)) > 0);

ALTER TABLE registrations 
ADD CONSTRAINT check_phone_not_empty CHECK (LENGTH(TRIM(phone)) > 0);

ALTER TABLE registrations 
ADD CONSTRAINT check_country_not_empty CHECK (LENGTH(TRIM(country)) > 0);

ALTER TABLE registrations 
ADD CONSTRAINT check_service_not_empty CHECK (LENGTH(TRIM(service)) > 0);

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS registrations_service_idx ON registrations(service);
CREATE INDEX IF NOT EXISTS registrations_created_at_idx ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS registrations_country_idx ON registrations(country);

-- Add function to validate registration fields before insert/update
CREATE OR REPLACE FUNCTION validate_registration_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Trim whitespace from text fields
  NEW.full_name = TRIM(NEW.full_name);
  NEW.email = TRIM(LOWER(NEW.email));
  NEW.phone = TRIM(NEW.phone);
  NEW.country = TRIM(NEW.country);
  NEW.service = TRIM(NEW.service);
  NEW.message = TRIM(COALESCE(NEW.message, ''));
  
  -- Validate that required fields are not empty
  IF LENGTH(NEW.full_name) = 0 THEN
    RAISE EXCEPTION 'Full name cannot be empty';
  END IF;
  
  IF LENGTH(NEW.email) = 0 THEN
    RAISE EXCEPTION 'Email cannot be empty';
  END IF;
  
  -- Simple email validation
  IF NEW.email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  IF LENGTH(NEW.phone) = 0 THEN
    RAISE EXCEPTION 'Phone cannot be empty';
  END IF;
  
  IF LENGTH(NEW.country) = 0 THEN
    RAISE EXCEPTION 'Country cannot be empty';
  END IF;
  
  IF LENGTH(NEW.service) = 0 THEN
    RAISE EXCEPTION 'Service cannot be empty';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate registration before insert/update
DROP TRIGGER IF EXISTS validate_registration_fields_trigger ON registrations;
CREATE TRIGGER validate_registration_fields_trigger
  BEFORE INSERT OR UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION validate_registration_fields();