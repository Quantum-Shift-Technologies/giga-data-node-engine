# GigaData Engine Backend

The **GigaData Engine** is a sovereign, AI-ready crop, climate, and disease ground-truth data platform designed to bridge the field-level data gap in Zimbabwean agriculture. Acting as a national data infrastructure asset, it securely connects geographical field boundaries, crop management operations, plant pathology diagnostics, and measured crop-cut harvest yields.

This project was submitted to the **Postal and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ)** under the *AI for Impact (AI4I) Challenge 2026 (Track 1 - Data)*.

---

## 🚀 Key Features & Use Cases

The backend API suite is structured directly around the 4 core use cases defined in the project proposal:

1. **Climate-Risk and Crop-Failure Predictions**: Provides field and district-level crop-failure probability indices to support agricultural risk assessment and index insurance models.
2. **Crop Migration and Suitability Analysis**: Tracks changes in planting windows and productive zones as farmers shift between maize, traditional grains, and legumes due to shifting climates.
3. **Plant Disease and Stress Outbreak Alerts**: Geotagged plant disease cases (e.g. Maize Streak Virus, Fall Armyworm) to feed crop health prediction models and optimize chemical input distribution.
4. **Pre-Harvest Yield Projections**: Calibrated pre-harvest yield estimations using measured crop cuts and satellite telemetry integration (Sentinel-2, CHIRPS).

---

## 🛠️ Technology Stack & Architecture

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js (REST API) & Apollo Server (GraphQL API)
- **Database (Primary)**: PostgreSQL (with PostGIS extensions for spatial mapping)
- **Database (Vector)**: Qdrant Vector DB (for plant pathology image embeddings and semantic crop-health RAG query search)
- **Data Lakehouse**: MinIO S3 Object Storage (hosting raw tabular Parquet files, GeoParquet, and raw image corpora)
- **Analytics Virtualization**: DuckDB (for querying MinIO parquet files on-the-fly without database ingestion overhead)
- **Documentation**: Swagger UI & OpenAPI Specification

---

## 📂 Project Structure

```
giga-data-engine-backend/
├── src/
│   ├── config/             # DB connection, databaseBootstrap, database config
│   ├── controllers/        # Route controllers (ingest, dataset, map, chatbot, commercial)
│   ├── docs/               # OpenAPI/Swagger configuration specifications
│   ├── graphql/            # GraphQL Schema (typeDefs) and Resolvers
│   ├── models/             # Sequelize ORM definitions (Farmer, Farm, Field, Yield, pathology)
│   ├── routes/             # REST route files (dataset, map, consent, media, chatbot, commercial)
│   └── services/           # External service integration layers (e.g. Qdrant, MinIO, DuckDB)
├── DATABASE_SCHEMA.sql     # PostgreSQL database layout baseline
├── index.mjs               # Core entry-point loading Express, DB init, & Apollo Server
└── package.json            # Scripts and dependencies declarations
```

---

## ⚡ API Quickstart

### REST endpoints
The base path for all REST APIs is `/api/v1`.

- **Swagger Docs**: `GET /api-docs` (Interactive documentation)
- **Datasets Catalog**: `GET /api/v1/datasets`
- **Climate Risk Index**: `GET /api/v1/commercial/climate-risk?district=Mutoko`
- **Crop Migration Shifts**: `GET /api/v1/commercial/crop-suitability-migration?target_crop=maize`
- **Disease Alert Feeds**: `GET /api/v1/commercial/disease-outbreak-alert?crop=maize`
- **Yield Projections**: `GET /api/v1/commercial/yield-projections?district=Mazowe`
- **Farmer Credit Profiling**: `GET /api/v1/commercial/credit/scores/:farmer_id`
- **ODK / WhatsApp Ingestion**: Ingest forms via `/api/v1/ingest/odk` and pathology images via `/api/v1/ingest/whatsapp-media`

### GraphQL Endpoint
Interact with the database using GraphQL queries at `/graphql`.

Example Query:
```graphql
query GetFieldDetails($fieldId: ID!) {
  field(field_id: $fieldId) {
    field_id
    area_ha
    soil_texture
    irrigation_status
    seasons {
      season_id
      primary_crop_code
      planting_date
      actual_harvest_date
      record_completeness_pct
    }
  }
}
```

---

## ⚙️ Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Environment**:
   Configure a `.env` file in the root directory based on the following template:
   ```env
   PORT=8000
   DATABASE_URL=postgres://user:password@localhost:5432/gigadata
   QDRANT_URL=http://localhost:6333
   MINIO_ENDPOINT=localhost
   MINIO_PORT=9000
   MINIO_ACCESS_KEY=your-minio-key
   MINIO_SECRET_KEY=your-minio-secret
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   *Note: Server runs on port `8000` by default. API endpoints will be accessible at `http://localhost:8000/api/v1`.*
