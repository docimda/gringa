-- Drop store_hours table if it exists (although we didn't create it explicitly in previous steps, ensuring cleanup)
DROP TABLE IF EXISTS store_hours;

-- Alter store_settings table
-- Remove opening_hours_start and opening_hours_end
-- Add observation field
ALTER TABLE store_settings 
DROP COLUMN IF EXISTS opening_hours_start,
DROP COLUMN IF EXISTS opening_hours_end,
ADD COLUMN IF NOT EXISTS observation TEXT;
