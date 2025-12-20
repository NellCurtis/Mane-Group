-- Create content versions table for tracking content changes
CREATE TABLE IF NOT EXISTS content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id uuid REFERENCES content(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  english_text TEXT NOT NULL,
  french_text TEXT NOT NULL,
  image_url TEXT,
  created_by uuid REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS content_versions_content_item_id_idx ON content_versions(content_item_id);
CREATE INDEX IF NOT EXISTS content_versions_created_at_idx ON content_versions(created_at);
CREATE INDEX IF NOT EXISTS content_versions_created_by_idx ON content_versions(created_by);

-- Enable RLS (Row Level Security)
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Authenticated users can view content versions" ON content_versions
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Editors and admins can create content versions" ON content_versions
FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u 
    WHERE u.id = auth.uid() AND u.role IN ('admin', 'editor')
  )
);

-- Grant permissions
GRANT ALL ON TABLE content_versions TO authenticated;