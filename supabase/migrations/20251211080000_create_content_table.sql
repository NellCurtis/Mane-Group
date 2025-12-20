-- Create content table for managing website content
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  englishText TEXT NOT NULL,
  frenchText TEXT NOT NULL,
  imageUrl TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS content_section_idx ON content(section);
CREATE INDEX IF NOT EXISTS content_key_idx ON content(key);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_updated_at BEFORE UPDATE
ON content FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Insert initial content data
INSERT INTO content (section, key, englishText, frenchText, imageUrl) VALUES
('driving-school-hero', 'title', 'Auto-École Mane d''Afrique', 'Auto-École Mane d''Afrique', NULL),
('driving-school-hero', 'subtitle', 'Navigate your journey to new opportunities with expert driving instruction', 'Naviguez vers de nouvelles opportunités avec une instruction de conduite experte', NULL),
('immigration-hero', 'title', 'MANÉ Immigration', 'MANÉ Immigration', NULL),
('languages-hero', 'title', 'Mane Multi-Linguistique', 'Mane Multi-Linguistique', NULL),
('innovation-hero', 'title', 'Mane Innovation', 'Mane Innovation', NULL),
('graphic-design-hero', 'title', 'Mane Graphic Design', 'Mane Graphisme', NULL)
ON CONFLICT DO NOTHING;