export const openapiSpecification = {
    openapi: "3.0.3",
    info: {
        title: "GigaData Engine REST & AI API",
        version: "1.0.0",
        description: "Sovereign Agronomic Data Infrastructure API serving geo-boundaries, yield logs, pathology diagnostics, and crop cut datasets.",
    },
    servers: [
        {
            url: "/",
        },
    ],
    tags: [
        { name: "Health" },
        { name: "Datasets" },
        { name: "Map Geometry" },
        { name: "Commercial Licensing" },
        { name: "AI Services" },
        { name: "Ingestion Webhooks" },
        { name: "Governance & Consent" }
    ],
    paths: {
        "/health": {
            get: {
                tags: ["Health"],
                summary: "Health Check",
                description: "Retrieve service health status.",
                responses: {
                    200: {
                        description: "Service is healthy",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        status: { type: "string", example: "ok" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/datasets": {
            get: {
                tags: ["Datasets"],
                summary: "Get All Datasets",
                description: "Retrieves a summary registry list of all sovereign agronomic datasets available.",
                parameters: [
                    { name: "tier", in: "query", schema: { type: "string" }, description: "Filter by medallion tier (e.g., Bronze, Silver, Gold)" },
                    { name: "search", in: "query", schema: { type: "string" }, description: "Full-text search on dataset title and description" },
                    { name: "limit", in: "query", schema: { type: "integer" }, description: "Number of records to return per page (default: 10)" },
                    { name: "page", in: "query", schema: { type: "integer" }, description: "Pagination offset (default: 1)" }
                ],
                responses: {
                    200: {
                        description: "List of datasets fetched successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/DatasetSummary"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/datasets/{dataset_id}": {
            get: {
                tags: ["Datasets"],
                summary: "Get Dataset Details",
                description: "Retrieves metadata of a specific dataset by its ID.",
                parameters: [
                    {
                        name: "dataset_id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Unique identifier of the dataset"
                    }
                ],
                responses: {
                    200: {
                        description: "Dataset metadata retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/DatasetSummary"
                                }
                            }
                        }
                    },
                    404: {
                        description: "Dataset not found"
                    }
                }
            }
        },
        "/api/v1/datasets/{dataset_id}/schema": {
            get: {
                tags: ["Datasets"],
                summary: "Get Dataset Schema",
                description: "Retrieves column definition, constraints, and descriptions mapping this dataset.",
                parameters: [
                    {
                        name: "dataset_id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Unique identifier of the dataset"
                    }
                ],
                responses: {
                    200: {
                        description: "Dataset schema retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        dataset_id: { type: "string", example: "maize_yield_surveys" },
                                        columns: {
                                            type: "array",
                                            items: {
                                                $ref: "#/components/schemas/ColumnSchema"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: "Dataset schema not found"
                    }
                }
            }
        },
        "/api/v1/datasets/{dataset_id}/sample": {
            get: {
                tags: ["Datasets"],
                summary: "Get Dataset Sample Preview",
                description: "Retrieves mock spreadsheet rows for browser grid preview (Bronze Tier).",
                parameters: [
                    {
                        name: "dataset_id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Unique identifier of the dataset"
                    }
                ],
                responses: {
                    200: {
                        description: "Dataset sample rows retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: "Dataset sample not found"
                    }
                }
            }
        },
        "/api/v1/datasets/{dataset_id}/download": {
            get: {
                tags: ["Datasets"],
                summary: "Download Full Dataset (Presigned URLs)",
                description: "Generates secure presigned S3 URLs to download bulk GeoParquet or annotated image bundles directly from MinIO (Gold Tier).",
                parameters: [
                    {
                        name: "dataset_id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Unique identifier of the dataset"
                    }
                ],
                responses: {
                    200: {
                        description: "Signed download URL generated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        dataset_id: { type: "string" },
                                        download_url: { type: "string", example: "https://minio.zchpc.co.zw/gold-tier/yields.parquet?signature=xyz" },
                                        expires_at: { type: "string" }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: "Dataset not found"
                    }
                }
            }
        },
        "/api/v1/map/boundaries": {
            get: {
                tags: ["Map Geometry"],
                summary: "Get Spatial Boundaries",
                description: "Fetches generalised GeoJSON feature coordinates tracing agricultural zones in Zimbabwe.",
                parameters: [
                    { name: "region", in: "query", schema: { type: "string" }, description: "Filter by natural farming region (e.g., II, III, IV)" },
                    { name: "crop_type", in: "query", schema: { type: "string" }, description: "Filter by dominant crop (e.g., MAIZE, SORGHUM)" },
                    { name: "limit", in: "query", schema: { type: "integer" }, description: "Maximum number of polygons to return" }
                ],
                responses: {
                    200: {
                        description: "GeoJSON FeatureCollection representing district boundaries",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        type: { type: "string", example: "FeatureCollection" },
                                        features: {
                                            type: "array",
                                            items: {
                                                type: "object"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/map/timeline": {
            get: {
                tags: ["Map Geometry"],
                summary: "Get Map Explorer Timeline",
                description: "Returns Ndvi, active reporting nodes, and weather statistics over historical timeslots.",
                parameters: [
                    { name: "year", in: "query", schema: { type: "integer" }, description: "Filter by planting year (e.g., 2026)" },
                    { name: "season", in: "query", schema: { type: "string" }, description: "Season identifier (e.g., 2025/26)" }
                ],
                responses: {
                    200: {
                        description: "Map timeline stats",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        dates: {
                                            type: "array",
                                            items: { type: "string" },
                                            example: ["April 2024", "August 2024", "Today"]
                                        },
                                        metrics_by_month: {
                                            type: "object"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/map/districts/{name}": {
            get: {
                tags: ["Map Geometry"],
                summary: "Get District Yield Details",
                description: "Returns agronomic summary Gdd, crop classification, coordinates, and average yield logs for specific districts.",
                parameters: [
                    {
                        name: "name",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "District identifier name (e.g. Bindura, Mutoko)"
                    }
                ],
                responses: {
                    200: {
                        description: "District information retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string", example: "Mutoko" },
                                        province: { type: "string", example: "Mashonaland East" },
                                        avg_yield: { type: "string", example: "4.35 t/ha" },
                                        dominant_crop: { type: "string", example: "Maize (SC 513)" }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: "District not found"
                    }
                }
            }
        },
        "/api/v1/map/indices/{field_id}": {
            get: {
                tags: ["Map Geometry"],
                summary: "Get Field-level NDVI & Weather Indices",
                description: "Retrieves time-series NDVI spectral logs and cumulative rainfall measurements for a specific field season (Silver Tier).",
                parameters: [
                    {
                        name: "field_id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Field UUID identifier"
                    }
                ],
                responses: {
                    200: {
                        description: "Telemetry timelines retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        field_id: { type: "string" },
                                        time_series: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    timestamp: { type: "string" },
                                                    ndvi: { type: "number" },
                                                    precipitation_mm: { type: "number" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/access-requests": {
            post: {
                tags: ["Commercial Licensing"],
                summary: "Submit Access Request",
                description: "Submit request to provision programmatic API access keys.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AccessRequest"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Access request registered successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AccessRequestResponse"
                                }
                            }
                        }
                    },
                    422: {
                        description: "Validation error"
                    }
                }
            },
            get: {
                tags: ["Commercial Licensing"],
                summary: "Get Access Requests History",
                description: "Auditing history logs of registered access licensing entries.",
                responses: {
                    200: {
                        description: "List of access requests",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/AccessRequestResponse"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/credit/scores/{farmer_id}": {
            get: {
                tags: ["Commercial Licensing"],
                summary: "Get Anonymized Farmer Credit Score",
                description: "Retrieves credit risk score rating based on historical farm performance and crop consistency indices, to assist CBZ/AFC credit lines (Silver Tier).",
                parameters: [
                    {
                        name: "farmer_id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Pseudonymised farmer hash"
                    }
                ],
                responses: {
                    200: {
                        description: "Credit scoring profiles retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        farmer_id: { type: "string" },
                                        credit_score: { type: "integer", example: 720 },
                                        risk_rating: { type: "string", example: "Low-Risk" },
                                        historical_seasons_count: { type: "integer" },
                                        average_management_timeliness: { type: "number" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/supply-chain/demand-forecast": {
            get: {
                tags: ["Commercial Licensing"],
                summary: "Get Regional Seed & Fertilizer Demand Forecast",
                description: "Fetches aggregated district estimates on seed varieties and fertilizer types to optimize supply chain delivery (Silver Tier).",
                responses: {
                    200: {
                        description: "Aggregated input forecast details",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            district: { type: "string" },
                                            predicted_crop: { type: "string" },
                                            estimated_seed_tons: { type: "number" },
                                            estimated_fertilizer_tons: { type: "number" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/policy/yield-forecast": {
            get: {
                tags: ["Commercial Licensing"],
                summary: "Get Pre-Harvest Food Security Projections",
                description: "Fetches pre-harvest yield forecasts by district to optimize strategic reserves and anticipatory food distributions (Silver Tier).",
                responses: {
                    200: {
                        description: "Yield forecast matrices retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            district: { type: "string" },
                                            expected_yield_metric_tons: { type: "number" },
                                            food_security_status: { type: "string", example: "SURPLUS" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/commercial/climate-risk": {
            get: {
                tags: ["Commercial Licensing"],
                summary: "Get Climate-Risk and Crop-Failure Predictions",
                description: "Commercially designed endpoint for insurers, finance providers, and development agencies to fetch field/district level crop failure likelihoods, drought indices, and premium suggestions.",
                parameters: [
                    { name: "district", in: "query", schema: { type: "string" }, description: "Filter by target district (e.g. Mutoko)" },
                    { name: "natural_region", in: "query", schema: { type: "string" }, description: "Zimbabwe agricultural natural region (e.g. II, III, IV)" }
                ],
                responses: {
                    200: {
                        description: "Mock risk evaluation data returned successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        use_case: { type: "string" },
                                        data: { type: "array", items: { type: "object" } }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/commercial/crop-suitability-migration": {
            get: {
                tags: ["Commercial Licensing"],
                summary: "Get Crop Migration & Suitability Shifts",
                description: "Tracks geographic suitability shifts of staple crops vs traditional grains and optimal planting window changes over multiple seasons. Essential for seed companies and national food planners.",
                parameters: [
                    { name: "target_crop", in: "query", schema: { type: "string" }, description: "Filter by crop type (e.g. maize, sorghum)" }
                ],
                responses: {
                    200: {
                        description: "Migration analysis data retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        use_case: { type: "string" },
                                        data: { type: "object" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/commercial/disease-outbreak-alert": {
            get: {
                tags: ["Commercial Licensing"],
                summary: "Get Plant Disease & Stress Outbreak Alerts",
                description: "Returns geo-hotspots of active disease and pest outbreaks (e.g., Maize Streak Virus, Fall Armyworm), severity ratings, and recommended chemical solutions. Highly valuable for agrochemical supply chains.",
                parameters: [
                    { name: "district", in: "query", schema: { type: "string" } },
                    { name: "crop", in: "query", schema: { type: "string" } }
                ],
                responses: {
                    200: {
                        description: "Outbreak notifications and intervention strategies",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        use_case: { type: "string" },
                                        data: { type: "object" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/commercial/yield-projections": {
            get: {
                tags: ["Commercial Licensing"],
                summary: "Get Pre-Harvest Yield Projections",
                description: "Leverages satellite telemetry (Sentinel-2, CHIRPS) calibrated with ground-truth quadrat crop cuts to project yield outcomes, grain supply chain availability, and strategic grain reserves.",
                parameters: [
                    { name: "district", in: "query", schema: { type: "string" } }
                ],
                responses: {
                    200: {
                        description: "Calibrated yield projections",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        use_case: { type: "string" },
                                        data: { type: "array", items: { type: "object" } }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/chatbot/query": {
            post: {
                tags: ["AI Services"],
                summary: "Query AI Agronomy Assistant",
                description: "Sends context prompt to query verified agronomy bulletins (RAG Integration).",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["message"],
                                properties: {
                                    message: { type: "string", example: "Maize streak virus symptoms" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Chatbot answers retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        text: { type: "string" },
                                        source_documents: {
                                            type: "array",
                                            items: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    422: {
                        description: "Validation error"
                    }
                }
            }
        },
        "/api/v1/ingest/orchestrate": {
            post: {
                tags: ["Ingestion Webhooks"],
                summary: "Gateway Ingestion Orchestrate Router",
                description: "Central smart entry-point API that parses, validates, and routes agronomic telemetry dynamically (relational to PostgreSQL/Sequelize, documents to Qdrant Vector DB, or time-series to TimescaleDB) based on its type.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["dataType", "payload"],
                                properties: {
                                    dataType: {
                                        type: "string",
                                        enum: ["YIELD", "DISEASE_LOG", "CLIMATE"],
                                        description: "The category of incoming dataset to route"
                                    },
                                    payload: {
                                        type: "object",
                                        description: "The raw telemetry data body containing relevant data schema parameters"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Data successfully validated and routed to targeted store"
                    },
                    422: {
                        description: "Validation error"
                    }
                }
            }
        },
        "/api/v1/ingest/odk": {
            post: {
                tags: ["Ingestion Webhooks"],
                summary: "Ingest ODK Survey & Polygons",
                description: "Receives survey JSON payloads from ARDAS extension tablets, performs Turf.js boundary validation checks, moisture calibration, and logs results in the Bronze Zone.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["farm_id", "survey_data"],
                                properties: {
                                    farm_id: { type: "string", example: "FARM-10029" },
                                    survey_data: { type: "object" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "ODK Submission parsed and scheduled for integration successfully"
                    },
                    422: {
                        description: "Validation error"
                    }
                }
            }
        },
        "/api/v1/ingest/whatsapp-media": {
            post: {
                tags: ["Ingestion Webhooks"],
                summary: "Upload Geotagged Crop Pathology Photo",
                description: "Ingests crowdsourced crop disease image telemetry and metadata sent via WhatsApp. Saves raw media file to MinIO S3 bucket.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["farmer_id", "media_url", "coordinates"],
                                properties: {
                                    farmer_id: { type: "string" },
                                    media_url: { type: "string" },
                                    coordinates: {
                                        type: "object",
                                        properties: {
                                            latitude: { type: "number" },
                                            longitude: { type: "number" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Media file registered and review scheduled"
                    }
                }
            }
        },
        "/api/v1/media/upload": {
            post: {
                tags: ["Ingestion Webhooks"],
                summary: "Upload Raw Media File with Custom Metadata",
                description: "Accepts binary file uploads (multipart/form-data) along with farmer identity, location, and crop information, storing the file in the MinIO S3 bucket and registering standard headers.",
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                type: "object",
                                required: ["file", "farmer_id"],
                                properties: {
                                    file: {
                                        type: "string",
                                        format: "binary",
                                        description: "The media file to upload (symptom photo, raw survey scan, etc.)"
                                    },
                                    farmer_id: {
                                        type: "string",
                                        description: "Pseudonymised farmer ID hash"
                                    },
                                    latitude: {
                                        type: "number",
                                        description: "Geotag latitude coordinate"
                                    },
                                    longitude: {
                                        type: "number",
                                        description: "Geotag longitude coordinate"
                                    },
                                    crop_code: {
                                        type: "string",
                                        description: "Standard crop code (e.g. MAIZE)"
                                    },
                                    disease_code: {
                                        type: "string",
                                        description: "Pathogen code if known (e.g. MSV)"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "File successfully uploaded and metadata registered",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        message: { type: "string" },
                                        storage_type: { type: "string" },
                                        bucket: { type: "string" },
                                        object_path: { type: "string" },
                                        presigned_url: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/consent/register": {
            post: {
                tags: ["Governance & Consent"],
                summary: "Register/Update Privacy Consent Profile",
                description: "Records or updates a farmer's consent parameters under Cyber and Data Protection Act (2021) guidelines. Direct PII is decoupled from analytical databases.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["farmer_id", "farmer_name", "phone_number"],
                                properties: {
                                    farmer_id: { type: "string" },
                                    farmer_name: { type: "string" },
                                    phone_number: { type: "string" },
                                    consent_version: { type: "string", default: "1.0" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Consent registered successfully"
                    }
                }
            }
        },
        "/api/v1/consent/withdraw": {
            post: {
                tags: ["Governance & Consent"],
                summary: "Withdraw Consent (Right to be Forgotten)",
                description: "Processes a farmer's consent withdrawal, immediately flagging related records to be withheld or purged.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["farmer_id"],
                                properties: {
                                    farmer_id: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Consent successfully withdrawn and cleanups queued"
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            DatasetSummary: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    emoji: { type: "string" },
                    description: { type: "string" },
                    creator: { type: "string" },
                    license: { type: "string" },
                    downloads: { type: "integer" },
                    votes: { type: "integer" },
                    size: { type: "string" },
                    format: { type: "string" },
                    last_updated: { type: "string" },
                    tier: { type: "string" },
                    coverage: { type: "string" },
                    resolution: { type: "string" },
                    records: { type: "integer" }
                }
            },
            ColumnSchema: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    data_type: { type: "string" },
                    description: { type: "string" },
                    nullable: { type: "boolean" },
                    constraints: { type: "string", nullable: true }
                }
            },
            AccessRequest: {
                type: "object",
                required: ["organization", "use_case", "project_description", "plan_selected"],
                properties: {
                    organization: { type: "string", minLength: 2 },
                    use_case: { type: "string" },
                    project_description: { type: "string", minLength: 10 },
                    plan_selected: { type: "string" }
                }
            },
            AccessRequestResponse: {
                type: "object",
                properties: {
                    request_id: { type: "string" },
                    organization: { type: "string" },
                    plan_selected: { type: "string" },
                    status: { type: "string" },
                    message: { type: "string" },
                    submission_timestamp: { type: "string" }
                }
            }
        }
    }
};
