-- Enhance content table with better constraints and indexes
-- Add unique constraint to prevent duplicate section/key combinations
-- Add validation constraints for required fields
-- Add more specific indexes for better query performance

-- Add unique constraint to prevent duplicate section/key combinations
ALTER TABLE content 
ADD CONSTRAINT unique_section_key_pair UNIQUE (section, key);

-- Add check constraints for required fields
ALTER TABLE content 
ADD CONSTRAINT check_section_not_empty CHECK (LENGTH(TRIM(section)) > 0);

ALTER TABLE content 
ADD CONSTRAINT check_key_not_empty CHECK (LENGTH(TRIM(key)) > 0);

ALTER TABLE content 
ADD CONSTRAINT check_english_text_not_empty CHECK (LENGTH(TRIM(englishText)) > 0);

ALTER TABLE content 
ADD CONSTRAINT check_french_text_not_empty CHECK (LENGTH(TRIM(frenchText)) > 0);

-- Add composite index for section and key for faster lookups
CREATE INDEX IF NOT EXISTS content_section_key_idx ON content(section, key);

-- Add index on updated_at for sorting by last modified
CREATE INDEX IF NOT EXISTS content_updated_at_idx ON content(updated_at DESC);

-- Add function to validate content before insert/update
CREATE OR REPLACE FUNCTION validate_content_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Trim whitespace from text fields
  NEW.section = TRIM(NEW.section);
  NEW.key = TRIM(NEW.key);
  NEW.englishText = TRIM(NEW.englishText);
  NEW.frenchText = TRIM(NEW.frenchText);
  
  -- Validate that required fields are not empty
  IF LENGTH(NEW.section) = 0 THEN
    RAISE EXCEPTION 'Section cannot be empty';
  END IF;
  
  IF LENGTH(NEW.key) = 0 THEN
    RAISE EXCEPTION 'Key cannot be empty';
  END IF;
  
  IF LENGTH(NEW.englishText) = 0 THEN
    RAISE EXCEPTION 'English text cannot be empty';
  END IF;
  
  IF LENGTH(NEW.frenchText) = 0 THEN
    RAISE EXCEPTION 'French text cannot be empty';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate content before insert/update
DROP TRIGGER IF EXISTS validate_content_fields_trigger ON content;
CREATE TRIGGER validate_content_fields_trigger
  BEFORE INSERT OR UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION validate_content_fields();