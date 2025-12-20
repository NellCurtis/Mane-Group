-- Enhance messages table with better constraints and indexes
-- Add validation constraints for required fields
-- Add more specific indexes for better query performance

-- Add check constraints for required fields
ALTER TABLE messages 
ADD CONSTRAINT check_name_not_empty CHECK (LENGTH(TRIM(name)) > 0);

ALTER TABLE messages 
ADD CONSTRAINT check_email_not_empty CHECK (LENGTH(TRIM(email)) > 0);

ALTER TABLE messages 
ADD CONSTRAINT check_subject_not_empty CHECK (LENGTH(TRIM(subject)) > 0);

ALTER TABLE messages 
ADD CONSTRAINT check_message_not_empty CHECK (LENGTH(TRIM(message)) > 0);

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS messages_subject_idx ON messages(subject);

-- Add function to validate message fields before insert/update
CREATE OR REPLACE FUNCTION validate_message_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Trim whitespace from text fields
  NEW.name = TRIM(NEW.name);
  NEW.email = TRIM(LOWER(NEW.email));
  NEW.subject = TRIM(NEW.subject);
  NEW.message = TRIM(NEW.message);
  NEW.phone = TRIM(COALESCE(NEW.phone, ''));
  
  -- Validate that required fields are not empty
  IF LENGTH(NEW.name) = 0 THEN
    RAISE EXCEPTION 'Name cannot be empty';
  END IF;
  
  IF LENGTH(NEW.email) = 0 THEN
    RAISE EXCEPTION 'Email cannot be empty';
  END IF;
  
  -- Simple email validation
  IF NEW.email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  IF LENGTH(NEW.subject) = 0 THEN
    RAISE EXCEPTION 'Subject cannot be empty';
  END IF;
  
  IF LENGTH(NEW.message) = 0 THEN
    RAISE EXCEPTION 'Message cannot be empty';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate message before insert/update
DROP TRIGGER IF EXISTS validate_message_fields_trigger ON messages;
CREATE TRIGGER validate_message_fields_trigger
  BEFORE INSERT OR UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION validate_message_fields();