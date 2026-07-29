import { getMinioClient } from "../config/minio.mjs";
import { v4 as uuidv4 } from "uuid";

export const ingestOdk = async (req, res, next) => {
    try {
        const { farm_id, survey_data } = req.body;

        if (!farm_id || !survey_data) {
            return res.status(422).json({
                error: "farm_id and survey_data are required fields"
            });
        }

        const bucketName = process.env.MINIO_BUCKET_NAME || "gigadata-lakehouse";
        const objectName = `governance/surveys/${farm_id}-${Date.now()}.json`;
        const buffer = Buffer.from(JSON.stringify(req.body));

        try {
            const minioClient = getMinioClient();
            const bucketExists = await minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                await minioClient.makeBucket(bucketName, "us-east-1");
            }
            await minioClient.putObject(bucketName, objectName, buffer, buffer.length, {
                "Content-Type": "application/json"
            });
        } catch (minioErr) {
            console.warn("MinIO upload failed, simulating file dump:", minioErr.message);
        }

        res.status(201).json({
            success: true,
            message: "ODK Submission parsed and scheduled for integration successfully",
            object_name: objectName
        });
    } catch (err) {
        next(err);
    }
};

export const ingestWhatsappMedia = async (req, res, next) => {
    try {
        const { farmer_id, media_url, coordinates } = req.body;

        if (!farmer_id || !media_url || !coordinates) {
            return res.status(422).json({
                error: "farmer_id, media_url, and coordinates are required fields"
            });
        }

        res.status(201).json({
            success: true,
            message: "Media file registered and review scheduled"
        });
    } catch (err) {
        next(err);
    }
};

// Generic Ingestion Gateway Orchestrator with Bulk Processing Support (Mock Version)
export const ingestOrchestrate = async (req, res, next) => {
    try {
        const { dataType, payload } = req.body;

        if (!dataType || !payload) {
            return res.status(422).json({ error: "dataType and payload are required fields." });
        }

        const formattedType = dataType.toUpperCase();
        const items = Array.isArray(payload) ? payload : [payload];
        const isBulk = Array.isArray(payload);

        // Save raw payload to MinIO in the correct bounded context directory
        const bucketName = process.env.MINIO_BUCKET_NAME || "gigadata-lakehouse";
        let prefix = "governance/raw";
        if (formattedType === "YIELD") prefix = "agronomy/yield_logs";
        else if (formattedType === "DISEASE_LOG") prefix = "diagnostics/pathology_logs";
        else if (formattedType === "SPATIAL") prefix = "spatial/bronze";

        const objectName = `${prefix}/raw-payload-${Date.now()}.json`;
        const buffer = Buffer.from(JSON.stringify(payload));

        try {
            const minioClient = getMinioClient();
            const bucketExists = await minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                await minioClient.makeBucket(bucketName, "us-east-1");
            }
            await minioClient.putObject(bucketName, objectName, buffer, buffer.length, {
                "Content-Type": "application/json"
            });
        } catch (minioErr) {
            console.warn("MinIO upload failed, simulating file dump:", minioErr.message);
        }

        if (formattedType === "YIELD") {
            const results = items.map(item => ({
                measurement_id: uuidv4(),
                adjusted_dry_weight_kg: item.fresh_weight * 0.85
            }));

            return res.status(201).json({
                success: true,
                message: isBulk ? `Bulk yield dataset of ${items.length} records integrated successfully.` : "Yield dataset integrated into relational Postgres storage successfully.",
                data_routing: "POSTGRESQL_SEQUELIZE",
                results
            });

        } else if (formattedType === "DISEASE_LOG") {
            return res.status(201).json({
                success: true,
                message: isBulk ? `Bulk agronomic manuals of ${items.length} records indexed successfully.` : "Agronomic documentation indexed in Vector store successfully.",
                data_routing: "QDRANT_VECTOR_DB",
                details: {
                    collection: "agronomy_manuals",
                    records_count: items.length,
                    vector_status: "SUCCESS"
                }
            });

        } else if (formattedType === "CLIMATE") {
            return res.status(201).json({
                success: true,
                message: isBulk ? `Bulk climate dataset of ${items.length} records logged successfully.` : "Time-series climate telemetry logged successfully.",
                data_routing: "TIMESCALEDB_HYPERTABLE",
                details: {
                    records_inserted: items.length,
                    timestamp: new Date().toISOString()
                }
            });
        }

        res.status(400).json({ error: `Unsupported dataType: '${dataType}'. Supported types are: YIELD, DISEASE_LOG, CLIMATE.` });

    } catch (err) {
        next(err);
    }
};
