import { getModels } from "../models/index.mjs";

export const resolvers = {
    Query: {
        farmers: async () => {
            return [
                { farmer_id: "FARMER-9988", gender_code: "M", age_band: "30-40", province_code: "Mashonaland East", district_code: "Mutoko", consent_status: "GRANTED" },
                { farmer_id: "FARMER-1234", gender_code: "F", age_band: "40-50", province_code: "Midlands", district_code: "Gweru", consent_status: "GRANTED" }
            ];
        },
        farmer: async (_, { id }) => {
            return { farmer_id: id, gender_code: "M", age_band: "30-40", province_code: "Mashonaland East", district_code: "Mutoko", consent_status: "GRANTED" };
        },
        farms: async () => {
            return [
                { farm_id: "FARM-7721", farm_name_code: "Moyo Farm", natural_region: "II", total_area_ha: 5.5, tenure_type: "Communal" }
            ];
        },
        farm: async (_, { id }) => {
            return { farm_id: id, farm_name_code: "Moyo Farm", natural_region: "II", total_area_ha: 5.5, tenure_type: "Communal" };
        },
        fields: async () => {
            return [
                { field_id: "FLD-001", farm_id: "FARM-7721", field_name_code: "Main Field", area_ha: 2.1, soil_texture: "Sandy Loam" }
            ];
        },
        field: async (_, { id }) => {
            return { field_id: id, farm_id: "FARM-7721", field_name_code: "Main Field", area_ha: 2.1, soil_texture: "Sandy Loam" };
        }
    },
    Farm: {
        fields: async (farm) => {
            return [
                { field_id: "FLD-001", farm_id: farm.farm_id, field_name_code: "Main Field", area_ha: 2.1, soil_texture: "Sandy Loam" }
            ];
        }
    },
    Field: {
        seasons: async (field) => {
            return [
                { field_season_id: "FS-2026", field_id: field.field_id, season_id: "2025/26", primary_crop_code: "MAIZE", planting_date: "2026-07-22" }
            ];
        }
    },
    FieldSeason: {
        measurements: async (season) => {
            return [
                { harvest_measurement_id: "HM-1", field_season_id: season.field_season_id, harvest_date: "2026-07-28", fresh_weight_kg: 4.5, grain_moisture_pct: 14.1, measured_yield_t_ha: 4.35, enumerator_id_hash: "ENUM-99" }
            ];
        }
    }
};
