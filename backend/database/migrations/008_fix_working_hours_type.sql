-- Migration: Change working_hours type to VARCHAR
-- This allows flexible string formats like "8 am to 5 pm"
ALTER TABLE users ALTER COLUMN working_hours TYPE VARCHAR(255) USING working_hours::VARCHAR;
