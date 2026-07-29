// In-memory storage for access requests
export const ACCESS_REQUEST_STORE = [];

// Mock datasets registry (matches Kaggle styles)
export const MOCK_DATASETS = [
    {
        id: "maize_yield_surveys",
        title: "Maize Yield Surveys 2023/24 - Zimbabwe",
        emoji: "🌽",
        description: "Field survey based maize yield estimates collected across major maize growing regions in Zimbabwe during the 2023/24 El Niño season.",
        creator: "Agri Intelligence Platform (AIP)",
        license: "Open Access (CC BY 4.0)",
        downloads: 1248,
        votes: 423,
        size: "124.5 MB",
        format: "CSV/Parquet",
        last_updated: "12 hours ago",
        tier: "Silver",
        coverage: "8 Provinces",
        resolution: "Field Level",
        records: 12428
    },
    {
        id: "sentinel_crop_grids",
        title: "Sentinel-2 Crop Classification Raster Grids",
        emoji: "🛰️",
        description: "Multi-spectral raster index bands mapping maize, sorghum, and millet zones at 10m resolution.",
        creator: "Copernicus Sentinel Ingest",
        license: "Sovereign Open",
        downloads: 842,
        votes: 295,
        size: "340.0 MB",
        format: "GeoTIFF",
        last_updated: "2 days ago",
        tier: "Gold",
        coverage: "National",
        resolution: "10m Grid",
        records: 1200
    },
    {
        id: "pathology_leaf_photos",
        title: "Maize Streak Virus Plant Leaf Diagnostics Corpus",
        emoji: "🍃",
        description: "12,000+ pathologist-verified smartphone plant leaf diagnostic photos detailing Maize Streak Virus and Fall Armyworm infections.",
        creator: "Crop Protection Lab (DR&SS)",
        license: "Research Use Only",
        downloads: 612,
        votes: 188,
        size: "1.2 GB",
        format: "JPEG/JSON",
        last_updated: "July 25, 2026",
        tier: "Gold",
        coverage: "Mashonaland & Midlands",
        resolution: "Single Leaf Photo",
        records: 12150
    },
    {
        id: "smallholder_field_polygons",
        title: "Smallholder Field Boundary Vector Polygons",
        emoji: "🗺️",
        description: "High-accuracy vector polygons tracing smallholder field boundaries across Zimbabwe, capturing acreage, slope, and elevation.",
        creator: "GIS Spatial Ingest Unit",
        license: "Open Access (CC BY 4.0)",
        downloads: 504,
        votes: 112,
        size: "85.2 MB",
        format: "GeoJSON",
        last_updated: "July 22, 2026",
        tier: "Bronze",
        coverage: "National Boundaries",
        resolution: "Field Geometry",
        records: 85000
    }
];

// Database schemas mapping for the datasets
export const MOCK_SCHEMAS = {
    maize_yield_surveys: [
        { name: "field_id", data_type: "VARCHAR(32)", description: "Unique salted pseudonymous field ID", nullable: false, constraints: "PRIMARY KEY" },
        { name: "province", data_type: "VARCHAR(64)", description: "Province name", nullable: false },
        { name: "district", data_type: "VARCHAR(64)", description: "District name", nullable: false },
        { name: "yield_t_ha", data_type: "FLOAT", description: "Measured crop-cut dry weight yield in tons per hectare", nullable: false },
        { name: "moisture_pct", data_type: "FLOAT", description: "Grain moisture percentage at harvest time", nullable: false },
        { name: "planting_date", data_type: "DATE", description: "Date crop was planted", nullable: false },
        { name: "variety", data_type: "VARCHAR(64)", description: "Seed variety code", nullable: true },
        { name: "field_size_ha", data_type: "FLOAT", description: "Total mapped field size in hectares", nullable: false }
    ],
    sentinel_crop_grids: [
        { name: "grid_cell_id", data_type: "VARCHAR(32)", description: "10m cell identifier", nullable: false, constraints: "PRIMARY KEY" },
        { name: "latitude", data_type: "FLOAT", description: "Centroid latitude", nullable: false },
        { name: "longitude", data_type: "FLOAT", description: "Centroid longitude", nullable: false },
        { name: "mean_ndvi", data_type: "FLOAT", description: "Mean Normalized Difference Vegetation Index value", nullable: false },
        { name: "mean_ndwi", data_type: "FLOAT", description: "Mean Normalized Difference Water Index value", nullable: false },
        { name: "crop_class", data_type: "VARCHAR(16)", description: "Classified crop: MAIZE, SORGHUM, MILLET", nullable: false }
    ],
    pathology_leaf_photos: [
        { name: "image_id", data_type: "VARCHAR(32)", description: "Unique image file UUID", nullable: false, constraints: "PRIMARY KEY" },
        { name: "file_path", data_type: "VARCHAR(256)", description: "Relative file path inside MinIO Object Store", nullable: false },
        { name: "health_class", data_type: "VARCHAR(32)", description: "Verified disease classification (HEALTHY, MSV, FAW)", nullable: false },
        { name: "severity_pct", data_type: "FLOAT", description: "Pathologist-annotated severity percentage", nullable: false },
        { name: "latitude_generalised", data_type: "FLOAT", description: "Masked latitude for PII protection", nullable: false },
        { name: "longitude_generalised", data_type: "FLOAT", description: "Masked longitude for PII protection", nullable: false }
    ],
    smallholder_field_polygons: [
        { name: "field_id", data_type: "VARCHAR(32)", description: "Unique field registry UUID", nullable: false, constraints: "PRIMARY KEY" },
        { name: "farm_id", data_type: "VARCHAR(32)", description: "Farm identifier hash", nullable: false },
        { name: "geom", data_type: "GEOMETRY(Polygon, 4326)", description: "PostGIS vector boundary polygon", nullable: false },
        { name: "area_ha", data_type: "FLOAT", description: "Calculated polygon area in hectares", nullable: false },
        { name: "elevation_m", data_type: "FLOAT", description: "Average elevation above sea level", nullable: true }
    ]
};

// Mock sample records for preview spreadsheets
export const MOCK_SAMPLES = {
    maize_yield_surveys: [
        { field_id: "ZIM-MASH-E-0001", province: "Mashonaland East", district: "Mutoko", yield_t_ha: 4.35, moisture_pct: 13.8, planting_date: "2026-07-22", variety: "SC 513", field_size_ha: 2.10 },
        { field_id: "ZIM-MID-0002", province: "Midlands", district: "Gweru", yield_t_ha: 3.92, moisture_pct: 14.1, planting_date: "2026-07-18", variety: "PAN 53", field_size_ha: 1.80 },
        { field_id: "ZIM-MASV-0003", province: "Masvingo", district: "Chiredzi", yield_t_ha: 4.78, moisture_pct: 13.2, planting_date: "2026-07-25", variety: "SC 403", field_size_ha: 2.50 },
        { field_id: "ZIM-MATN-0004", province: "Matabeleland North", district: "Binga", yield_t_ha: 2.91, moisture_pct: 15.6, planting_date: "2026-07-28", variety: "SC 627", field_size_ha: 1.60 },
        { field_id: "ZIM-MASH-C-0005", province: "Mashonaland Central", district: "Centenary", yield_t_ha: 5.12, moisture_pct: 12.9, planting_date: "2026-07-20", variety: "SC 513", field_size_ha: 2.30 }
    ],
    sentinel_crop_grids: [
        { grid_cell_id: "grid_36592", latitude: -17.432, longitude: 31.021, mean_ndvi: 0.62, mean_ndwi: 0.28, crop_class: "MAIZE" },
        { grid_cell_id: "grid_36593", latitude: -17.432, longitude: 31.022, mean_ndvi: 0.58, mean_ndwi: 0.22, crop_class: "MAIZE" },
        { grid_cell_id: "grid_36594", latitude: -17.433, longitude: 31.021, mean_ndvi: 0.41, mean_ndwi: 0.15, crop_class: "SORGHUM" },
        { grid_cell_id: "grid_36595", latitude: -17.434, longitude: 31.023, mean_ndvi: 0.35, mean_ndwi: 0.08, crop_class: "MILLET" }
    ],
    pathology_leaf_photos: [
        { image_id: "img-uuid-001", file_path: "silver/crop_health/img_001.jpg", health_class: "HEALTHY", severity_pct: 0.0, latitude_generalised: -17.82, longitude_generalised: 31.05 },
        { image_id: "img-uuid-002", file_path: "silver/crop_health/img_002.jpg", health_class: "MSV_SEV_2", severity_pct: 45.5, latitude_generalised: -17.83, longitude_generalised: 31.06 },
        { image_id: "img-uuid-003", file_path: "silver/crop_health/img_003.jpg", health_class: "FAW_SEV_3", severity_pct: 72.1, latitude_generalised: -17.81, longitude_generalised: 31.04 }
    ],
    smallholder_field_polygons: [
        { field_id: "fld_001", farm_id: "frm_hash_89a", geom: "POLYGON((31.02 -17.43, 31.03 -17.43, 31.03 -17.44, 31.02 -17.44, 31.02 -17.43))", area_ha: 1.25, elevation_m: 1210.0 },
        { field_id: "fld_002", farm_id: "frm_hash_94b", geom: "POLYGON((31.05 -17.45, 31.06 -17.45, 31.06 -17.46, 31.05 -17.46, 31.05 -17.45))", area_ha: 0.95, elevation_m: 1195.0 }
    ]
};

// District-level data for Map Explorer
export const MOCK_DISTRICTS = {
    mutoko: {
        name: "Mutoko",
        province: "Mashonaland East",
        avg_yield: "4.35 t/ha",
        gdd: "1,850 degree days",
        rainfall: "620 mm",
        fields_mapped: 1428,
        dominant_crop: "Maize (SC 513)",
        coordinates: { lat: -17.397, lng: 32.226 }
    },
    bindura: {
        name: "Bindura",
        province: "Mashonaland Central",
        avg_yield: "5.12 t/ha",
        gdd: "1,920 degree days",
        rainfall: "780 mm",
        fields_mapped: 1820,
        dominant_crop: "Maize (SC 627)",
        coordinates: { lat: -17.301, lng: 31.330 }
    },
    mazowe: {
        name: "Mazowe",
        province: "Mashonaland Central",
        avg_yield: "5.60 t/ha",
        gdd: "1,980 degree days",
        rainfall: "850 mm",
        fields_mapped: 2240,
        dominant_crop: "Maize / Soybeans",
        coordinates: { lat: -17.502, lng: 30.985 }
    }
};

// AI Chatbot response mapping matching GigaData context
export const CHATBOT_KNOWLEDGE = {
    symptoms: "Maize Streak Virus (MSV) symptoms include thin, discontinuous yellow-to-white streaks running parallel along the leaf veins. In severe cases, these streaks coalesce, leading to leaf chlorosis, stunted crop growth, and failed cob development. Early treatment involves vector control targeting Leafhoppers (Cicadulina mbila).",
    verification: "GigaData Engine verifies crop-cut yield measurements using standard 2m x 2m quadrats. Officers harvest, shell, and weigh the maize wet weight, then use digital moisture meters to adjust the readings to a standard 12.5% grain moisture content. This ground-truth metric validates spatial Sentinel-2 NDVI predictions.",
    migration: "Historical telemetry indicates a shift in maize cultivation window in Natural Region IV (semi-arid zones like Masvingo and Matabeleland South). Due to compressed rain seasons, planting calendars are shifting from early November to late December, accompanied by a transition toward early-maturing varieties (e.g., SC 403) and drought-tolerant Sorghum.",
    about: "GigaData Engine is a sovereign geospatial medallion data lakehouse. It ingests ground-truth farming observations, spatial field boundaries, pathology image records, and weather sensor data. The platform clean-transforms raw inputs into AI-ready dataset schemas for credit scoring, index insurance, and ML training pipelines."
};

export function getBotResponse(query) {
    const cleanQuery = query.toLowerCase();
    if (cleanQuery.includes("streak") || cleanQuery.includes("symptom") || cleanQuery.includes("disease")) {
        return {
            text: CHATBOT_KNOWLEDGE.symptoms,
            source_documents: ["DR&SS Maize Pathology Bulletin Vol. 4", "Crop Disease Diagnostics Schema (v1.0)"]
        };
    } else if (cleanQuery.includes("verify") || cleanQuery.includes("crop-cut") || cleanQuery.includes("harvest")) {
        return {
            text: CHATBOT_KNOWLEDGE.verification,
            source_documents: ["FAO Smallholder Crop-Cut Guidelines", "Harvest Telemetry Yield Registry Schema (v1.1)"]
        };
    } else if (cleanQuery.includes("migration") || cleanQuery.includes("region iv") || cleanQuery.includes("shift")) {
        return {
            text: CHATBOT_KNOWLEDGE.migration,
            source_documents: ["Zimbabwe Agroclimatic Shift Assessment 2024", "National Agronomic Core Dataset"]
        };
    } else {
        return {
            text: CHATBOT_KNOWLEDGE.about,
            source_documents: ["GigaData Engine Architecture Overview", "POTRAZ Cyber & Data Protection Consent Policy (2021)"]
        };
    }
}
