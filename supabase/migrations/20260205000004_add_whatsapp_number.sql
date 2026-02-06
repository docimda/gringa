-- Add whatsapp_number column to store_settings table
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT DEFAULT '5535991154125';
