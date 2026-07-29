# MinIO Object Storage Structure (Lakehouse)

The GigaData Engine utilizes MinIO as its primary S3-compatible object storage layer. It follows a strict **Medallion Architecture** (Bronze, Silver, Gold) to categorize data as it moves from raw ingestion to machine-learning-ready features.

## Directory Structure & Navigation

The hierarchical file structure is designed to enable efficient partition pruning and data provenance auditing. Media uploads are granularly partitioned by user identity and submission date to ensure directories remain performant and easily navigable.

```mermaid
graph TD
    Bucket[gigadata-lakehouse Bucket] 

    %% Bronze Layer
    Bucket --> Bronze[bronze/ (Raw Ingestion)]
    Bronze --> B_Gov[governance/]
    B_Gov --> B_Gov_Sur[surveys/]
    B_Gov_Sur --> B_Gov_File["{farm_id}-{timestamp}.json"]

    Bronze --> B_Agro[agronomy/]
    B_Agro --> B_Agro_Y[yield_logs/]
    B_Agro_Y --> B_Agro_File["raw-payload-{timestamp}.json"]

    Bronze --> B_Crop[crop_health/]
    B_Crop --> B_Crop_Farm["{farmer_id}/ (User Grouping)"]
    B_Crop_Farm --> B_Crop_Year["{YYYY}/"]
    B_Crop_Year --> B_Crop_Month["{MM}/"]
    B_Crop_Month --> B_Crop_Date["{DD}/ (Daily Partition)"]
    B_Crop_Date --> B_Crop_File["{timestamp}-{filename}.jpg"]

    %% Silver Layer
    Bucket --> Silver[silver/ (Cleaned & Standardized)]
    Silver --> S_Agro[agronomy/]
    S_Agro --> S_Agro_File["validated_yields.parquet"]
    
    Silver --> S_Diag[diagnostics/]
    S_Diag --> S_Diag_Proc[processed_images/]
    S_Diag_Proc --> S_Diag_File["{image_uuid}_224x224.jpg"]
    
    %% Gold Layer
    Bucket --> Gold[gold/ (Aggregated Features)]
    Gold --> G_Feat[features/]
    G_Feat --> G_Feat_File["maize_yield_surveys.parquet"]
```

## Medallion Layers Detailed

### 1. Bronze Layer (`bronze/`)
This is the **landing zone** for raw data. Files here are immutable and saved exactly as they are received from ingestion endpoints (ODK collect, chat bots, satellite APIs).

* **Diagnostics (`crop_health/`)**: Raw pathology images are stored here. To manage scale and provenance, the path is partitioned by user and date: `bronze/crop_health/{farmer_id}/{YYYY}/{MM}/{DD}/`. This hierarchical grouping prevents directory bloat and allows administrators to easily audit a specific user's historical submissions (e.g., `bronze/crop_health/farmer-001/2026/07/28/178525819-leaf_rust.jpg`). Standard EXIF data (e.g., GPS coordinates, timestamp) and custom `x-amz-meta-*` headers (e.g., crop code, disease code) are persistently stored alongside each object as metadata.
* **Governance (`governance/surveys/`)**: Stores raw JSON files containing field survey submissions and PII metadata, tagged by `farm_id`.
* **Agronomy (`agronomy/yield_logs/`)**: Stores unprocessed crop-cut metrics and telemetry payloads.
* **Spatial (`spatial/`)**: Stores raw GeoJSON or KML files representing unverified field boundaries.

### 2. Silver Layer (`silver/`)
This is the **cleansed and conformed** zone. Data pipelines pick up files from `bronze/`, clean them, validate schemas, and save them here.
- `silver/diagnostics/processed_images/`: Compressed, normalized, and resized images ready for computer vision models. The `farmer_id` prefix is dropped in favor of a clean UUID to preserve anonymity during ML training.
- Data in this layer is frequently stored as columnar `Parquet` files for efficient querying by OLAP tools.

### 3. Gold Layer (`gold/`)
This is the **curated business-level** zone. It contains aggregated data specifically formatted for the frontend APIs, Map Explorer, and ML training pipelines.
- `gold/features/maize_yield_surveys.parquet`: The aggregated feature store that the API catalog serves for data scientists and institutional partners to download.
