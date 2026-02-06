-- Create store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opening_hours_start TIME NOT NULL DEFAULT '08:00',
  opening_hours_end TIME NOT NULL DEFAULT '18:00',
  is_open_manually BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings if not exists
INSERT INTO store_settings (opening_hours_start, opening_hours_end)
SELECT '08:00', '18:00'
WHERE NOT EXISTS (SELECT 1 FROM store_settings);
