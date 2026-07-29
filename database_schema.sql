-- GigaData Engine Database Schema Documentation
-- Dialect: PostgreSQL

-- ==========================================
-- 1. SCHEMAS
-- ==========================================
CREATE SCHEMA IF NOT EXISTS "governance";
CREATE SCHEMA IF NOT EXISTS "spatial";
CREATE SCHEMA IF NOT EXISTS "agronomy";
CREATE SCHEMA IF NOT EXISTS "diagnostics";

-- ==========================================
-- 2. GOVERNANCE SCHEMA
-- ==========================================

-- Farmers Table
CREATE TABLE IF NOT EXISTS "governance"."farmers" (
    "farmer_id" VARCHAR(64) PRIMARY KEY,
    "gender_code" CHAR(1),
    "age_band" VARCHAR(16),
    "preferred_language" VARCHAR(32) DEFAULT 'English',
    "farming_experience_band" VARCHAR(32),
    "primary_livelihood" VARCHAR(64),
    "province_code" VARCHAR(8),
    "district_code" VARCHAR(8),
    "ward_code" VARCHAR(16),
    "consent_status" VARCHAR(16) DEFAULT 'VALID',
    "registration_date" DATE,
    "quality_flag" VARCHAR(16) DEFAULT 'PASS',
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS "farmers_district_code" ON "governance"."farmers" ("district_code");
CREATE INDEX IF NOT EXISTS "farmers_consent_status" ON "governance"."farmers" ("consent_status");

-- Consent Registry Restricted Table
CREATE TABLE IF NOT EXISTS "governance"."consent_registry_restricted" (
    "consent_record_id" UUID PRIMARY KEY,
    "farmer_id" VARCHAR(64) NOT NULL UNIQUE,
    "farmer_name" VARCHAR(128) NOT NULL,
    "phone_number" VARCHAR(32) NOT NULL,
    "identity_reference" VARCHAR(64),
    "consent_version" VARCHAR(16) NOT NULL DEFAULT '1.0',
    "consent_timestamp" TIMESTAMP WITH TIME ZONE,
    "location_consent_status" VARCHAR(16) NOT NULL DEFAULT 'GRANTED',
    "image_consent_status" VARCHAR(16) NOT NULL DEFAULT 'GRANTED',
    "data_sharing_consent_status" VARCHAR(16) NOT NULL DEFAULT 'GRANTED',
    "withdrawal_status" VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS "consent_registry_farmer_id" ON "governance"."consent_registry_restricted" ("farmer_id");

-- ==========================================
-- 3. SPATIAL SCHEMA
-- ==========================================

-- Farms Table
CREATE TABLE IF NOT EXISTS "spatial"."farms" (
    "farm_id" UUID PRIMARY KEY,
    "farm_name_code" VARCHAR(32),
    "farm_centroid" JSONB, -- GeoJSON Point (Fallback for GEOMETRY)
    "farm_polygon" JSONB, -- GeoJSON Polygon (Fallback for GEOMETRY)
    "natural_region" CHAR(5),
    "elevation_m" FLOAT,
    "total_area_ha" FLOAT,
    "tenure_type" VARCHAR(32),
    "primary_water_source" VARCHAR(32),
    "polygon_validation_status" VARCHAR(16) DEFAULT 'UNVERIFIED',
    "quality_flag" VARCHAR(16) DEFAULT 'PASS',
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS "farms_natural_region" ON "spatial"."farms" ("natural_region");
CREATE INDEX IF NOT EXISTS "farms_polygon_val_status" ON "spatial"."farms" ("polygon_validation_status");

-- Fields Table
CREATE TABLE IF NOT EXISTS "spatial"."fields" (
    "field_id" UUID PRIMARY KEY,
    "farm_id" UUID NOT NULL REFERENCES "spatial"."farms" ("farm_id") ON DELETE CASCADE,
    "field_name_code" VARCHAR(32),
    "field_polygon" JSONB, -- GeoJSON Polygon (Fallback for GEOMETRY)
    "area_ha" FLOAT,
    "soil_texture" VARCHAR(32),
    "irrigation_status" VARCHAR(32) DEFAULT 'RAINFED',
    "quality_flag" VARCHAR(16) DEFAULT 'PASS',
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS "fields_farm_id" ON "spatial"."fields" ("farm_id");

-- ==========================================
-- 4. AGRONOMY SCHEMA
-- ==========================================

-- Field Seasons Table
CREATE TABLE IF NOT EXISTS "agronomy"."field_seasons" (
    "field_season_id" UUID PRIMARY KEY,
    "field_id" UUID NOT NULL REFERENCES "spatial"."fields" ("field_id") ON DELETE CASCADE,
    "season_id" VARCHAR(16) NOT NULL,
    "season_status" VARCHAR(24) DEFAULT 'ACTIVE',
    "primary_crop_code" VARCHAR(32) NOT NULL,
    "primary_variety_code" VARCHAR(32),
    "planting_date" DATE,
    "actual_harvest_date" DATE,
    "record_completeness_pct" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS "field_seasons_field_id" ON "agronomy"."field_seasons" ("field_id");
CREATE INDEX IF NOT EXISTS "field_seasons_season_id" ON "agronomy"."field_seasons" ("season_id");
CREATE INDEX IF NOT EXISTS "field_seasons_crop_code" ON "agronomy"."field_seasons" ("primary_crop_code");

-- Harvest Measurements Table
CREATE TABLE IF NOT EXISTS "agronomy"."harvest_measurements" (
    "harvest_measurement_id" UUID PRIMARY KEY,
    "field_season_id" UUID NOT NULL REFERENCES "agronomy"."field_seasons" ("field_season_id") ON DELETE CASCADE,
    "harvest_date" DATE NOT NULL,
    "quadrat_area_m2" FLOAT DEFAULT 4.0,
    "number_of_quadrats" INTEGER DEFAULT 1,
    "fresh_weight_kg" FLOAT NOT NULL,
    "grain_moisture_pct" FLOAT NOT NULL,
    "adjusted_dry_weight_kg" FLOAT,
    "measured_yield_t_ha" FLOAT,
    "enumerator_id_hash" VARCHAR(64) NOT NULL,
    "verification_status" VARCHAR(16) DEFAULT 'PENDING',
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS "harvest_measurements_fs_id" ON "agronomy"."harvest_measurements" ("field_season_id");

-- ==========================================
-- 5. DIAGNOSTICS SCHEMA
-- ==========================================

-- Pathology Records Table
CREATE TABLE IF NOT EXISTS "diagnostics"."pathology_records" (
    "pathology_record_id" UUID PRIMARY KEY,
    "field_season_id" UUID REFERENCES "agronomy"."field_seasons" ("field_season_id") ON DELETE SET NULL,
    "farmer_id_hash" VARCHAR(64),
    "disease_code" VARCHAR(32),
    "severity_score" FLOAT,
    "confidence_score" FLOAT,
    "image_s3_path" VARCHAR(255),
    "vector_qdrant_id" VARCHAR(64),
    "expert_verified" BOOLEAN DEFAULT false,
    "diagnosis_date" DATE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS "pathology_records_fs_id" ON "diagnostics"."pathology_records" ("field_season_id");
CREATE INDEX IF NOT EXISTS "pathology_records_disease" ON "diagnostics"."pathology_records" ("disease_code");
