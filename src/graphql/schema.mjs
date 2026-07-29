export const typeDefs = `#graphql
    type Farmer {
        farmer_id: String!
        gender_code: String
        age_band: String
        preferred_language: String
        farming_experience_band: String
        primary_livelihood: String
        province_code: String
        district_code: String
        ward_code: String
        consent_status: String
        registration_date: String
        quality_flag: String
    }

    type Farm {
        farm_id: ID!
        farm_name_code: String
        natural_region: String
        elevation_m: Float
        total_area_ha: Float
        tenure_type: String
        primary_water_source: String
        polygon_validation_status: String
        quality_flag: String
        fields: [Field]
    }

    type Field {
        field_id: ID!
        farm_id: ID!
        field_name_code: String
        area_ha: Float
        soil_texture: String
        irrigation_status: String
        quality_flag: String
        seasons: [FieldSeason]
    }

    type FieldSeason {
        field_season_id: ID!
        field_id: ID!
        season_id: String!
        season_status: String
        primary_crop_code: String!
        primary_variety_code: String
        planting_date: String
        actual_harvest_date: String
        record_completeness_pct: Int
        measurements: [HarvestMeasurement]
    }

    type HarvestMeasurement {
        harvest_measurement_id: ID!
        field_season_id: ID!
        harvest_date: String!
        quadrat_area_m2: Float
        number_of_quadrats: Int
        fresh_weight_kg: Float!
        grain_moisture_pct: Float!
        adjusted_dry_weight_kg: Float
        measured_yield_t_ha: Float
        enumerator_id_hash: String!
        verification_status: String
    }

    type Query {
        farmers: [Farmer]
        farmer(id: String!): Farmer
        farms: [Farm]
        farm(id: ID!): Farm
        fields: [Field]
        field(id: ID!): Field
    }
`;
