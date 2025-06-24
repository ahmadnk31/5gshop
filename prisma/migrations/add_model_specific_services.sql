-- Migration to add model-specific fields to RepairService
ALTER TABLE repair_services ADD COLUMN specificBrand TEXT;
ALTER TABLE repair_services ADD COLUMN specificModel TEXT;
ALTER TABLE repair_services ADD COLUMN priceVariations TEXT; -- JSON for model-specific pricing

-- Update the schema to support model-specific services
-- specificBrand: null = applies to all brands, "Apple" = only for Apple devices
-- specificModel: null = applies to all models of the brand, "iPhone 15 Pro" = only for this model
-- priceVariations: JSON object like {"iPhone 15 Pro": 120, "iPhone 14": 100} for model-specific pricing
