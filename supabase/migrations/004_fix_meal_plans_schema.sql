-- Fix meal_plans table schema to match the new Meal Plan Wizard API

-- Add new columns
ALTER TABLE meal_plans ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE meal_plans ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE meal_plans ADD COLUMN IF NOT EXISTS plan_type TEXT;
ALTER TABLE meal_plans ADD COLUMN IF NOT EXISTS people INT;
ALTER TABLE meal_plans ADD COLUMN IF NOT EXISTS meals_per_day INT;
ALTER TABLE meal_plans ADD COLUMN IF NOT EXISTS total_prep_time_hours NUMERIC;
ALTER TABLE meal_plans ADD COLUMN IF NOT EXISTS plan_data JSONB;

-- Make old required columns optional (they may have data)
ALTER TABLE meal_plans ALTER COLUMN family_size DROP NOT NULL;
ALTER TABLE meal_plans ALTER COLUMN days DROP NOT NULL;
ALTER TABLE meal_plans ALTER COLUMN meals DROP NOT NULL;
ALTER TABLE meal_plans ALTER COLUMN plan DROP NOT NULL;
