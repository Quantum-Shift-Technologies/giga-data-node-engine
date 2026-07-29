# POST API Endpoints & Sample Payloads

This document outlines all the `POST` endpoints available in the GigaData Engine backend, along with sample request bodies.

---

## 1. Access Requests API

### **Submit Data Access Request**
* **Endpoint**: `/api/v1/access-requests/`
* **Content-Type**: `application/json`
* **Description**: Submits a request for an institutional data access token.

```json
{
  "organization": "AgriTech Innovations",
  "use_case": "Yield Prediction Modeling",
  "project_description": "We intend to cross-reference the maize yield surveys with our proprietary weather models to forecast national supply.",
  "plan_selected": "ENTERPRISE"
}
```

---

## 2. AI Chatbot API

### **Query Chatbot**
* **Endpoint**: `/api/v1/chatbot/query`
* **Content-Type**: `application/json`
* **Description**: Sends a natural language query to the RAG AI chatbot.

```json
{
  "query": "What are the symptoms of Maize Streak Virus and how do I verify it?"
}
```

---

## 3. Consent Management API

### **Register Consent Profile**
* **Endpoint**: `/api/v1/consent/register`
* **Content-Type**: `application/json`
* **Description**: Registers a farmer's PII consent profile for compliance with Data Protection policies.

```json
{
  "farmer_id": "FARMER-9988",
  "farmer_name": "Tatenda Moyo",
  "phone_number": "+263772123456",
  "consent_version": "1.0"
}
```

### **Withdraw Consent Profile**
* **Endpoint**: `/api/v1/consent/withdraw`
* **Content-Type**: `application/json`
* **Description**: Initiates a withdrawal of consent and queues downstream PII redaction.

```json
{
  "farmer_id": "FARMER-9988"
}
```

---

## 4. Ingestion Engine API

### **Ingest ODK Survey**
* **Endpoint**: `/api/v1/ingest/odk`
* **Content-Type**: `application/json`
* **Description**: Receives a raw Open Data Kit (ODK) survey JSON payload.

```json
{
  "farm_id": "FARM-7721",
  "survey_data": {
    "survey_version": "v2.1",
    "water_source": "Borehole",
    "fertilizer_used": "Ammonium Nitrate"
  }
}
```

### **Ingest WhatsApp Media**
* **Endpoint**: `/api/v1/ingest/whatsapp-media`
* **Content-Type**: `application/json`
* **Description**: Receives media metadata relayed from the WhatsApp bot (non-file payload).

```json
{
  "farmer_id": "FARMER-9988",
  "media_url": "https://whatsapp-engine.internal/media/ab39f.jpg",
  "coordinates": {
    "latitude": -17.82,
    "longitude": 31.05
  }
}
```

### **Generic Orchestrator (Bulk & Single)**
* **Endpoint**: `/api/v1/ingest/orchestrate`
* **Content-Type**: `application/json`
* **Description**: The primary orchestration gateway that routes payloads to the correct medallion schemas (YIELD, DISEASE_LOG, CLIMATE). Supports bulk arrays or single objects.

```json
{
  "dataType": "YIELD",
  "payload": [
    {
      "field_id": "FLD-001",
      "fresh_weight": 4.5,
      "moisture_pct": 14.1
    },
    {
      "field_id": "FLD-002",
      "fresh_weight": 5.1,
      "moisture_pct": 13.8
    }
  ]
}
```

---

## 5. Media Upload API

### **Upload WhatsApp Diagnostics Media**
* **Endpoint**: `/api/v1/media/upload`
* **Content-Type**: `multipart/form-data`
* **Description**: Directly uploads binary media files (e.g. from the WhatsApp Bot engine) into MinIO, partitioned dynamically by date.

**Form Data Fields**:
* `file`: (Binary File) `leaf_rust.jpg`
* `farmer_id`: `FARMER-9988`
* `latitude`: `-17.82` (Optional)
* `longitude`: `31.05` (Optional)
* `crop_code`: `MAIZE` (Optional)
* `disease_code`: `LEAF_RUST` (Optional)

---

## 6. Technical Walkthrough Test Scenarios (For Judging)

The following scenarios utilize the APIs above to prove the engine meets the Hackathon's Technical Walkthrough requirements:

### **Test Scenario A: Quality Check Validation (Pass/Fail)**
**Requirement**: *Demonstrate one rule that passes, warns or blocks release, including a failed example and correction path.*
* **Step 1 (Fail)**: Send a `POST /api/v1/ingest/orchestrate` request with an invalid `dataType` (e.g. `"dataType": "UNSUPPORTED_TYPE"`).
* **Result**: The engine blocks the upload and returns a `400 Bad Request` explaining that only `YIELD`, `DISEASE_LOG`, and `CLIMATE` are supported.
* **Step 2 (Pass/Correction)**: Send the same request but correct `"dataType": "YIELD"`.
* **Result**: The engine validates the payload, routes the data to the Bronze layer, and returns a `201 Created` success message.

### **Test Scenario B: Data Provenance & Tracing**
**Requirement**: *Show where the record came from, who controls the source and how collection/access is managed.*
* **Step 1**: Use the **Media Upload API** (`POST /api/v1/media/upload`) to submit a dummy image with `farmer_id=FARMER-123`.
* **Result**: Explain that the engine automatically created the partitioned path `bronze/crop_health/FARMER-123/{YYYY}/{MM}/{DD}/` in the MinIO lakehouse.
* **Step 2**: Point out that the `latitude`, `longitude`, and source origin are permanently embedded in the object's metadata headers.

### **Test Scenario C: Governance & Consent Management**
**Requirement**: *Explain what is open, controlled or withheld and how the dataset will be handed over and maintained.*
* **Step 1**: Trigger a `POST /api/v1/consent/withdraw` with a specific `farmer_id`.
* **Result**: Explain that while Gold-tier aggregated features are open, raw PII is controlled. This API allows farmers to maintain data sovereignty by queueing their PII for downstream redaction from machine learning pipelines.
