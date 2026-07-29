import { MOCK_DATASETS, MOCK_SCHEMAS, MOCK_SAMPLES } from "../models/mockData.mjs";
import { getMinioClient } from "../config/minio.mjs";

export const getDatasets = (req, res, next) => {
    try {
        res.json(MOCK_DATASETS);
    } catch (err) {
        next(err);
    }
};

export const getDatasetById = (req, res, next) => {
    try {
        const { dataset_id } = req.params;
        const dataset = MOCK_DATASETS.find(d => d.id === dataset_id);
        if (!dataset) {
            return res.status(404).json({ detail: `Dataset with ID '${dataset_id}' not found` });
        }
        res.json(dataset);
    } catch (err) {
        next(err);
    }
};

export const getDatasetSchema = (req, res, next) => {
    try {
        const { dataset_id } = req.params;
        const schema = MOCK_SCHEMAS[dataset_id];
        if (!schema) {
            return res.status(404).json({ detail: `Schema for dataset '${dataset_id}' not found` });
        }
        res.json({
            dataset_id,
            columns: schema
        });
    } catch (err) {
        next(err);
    }
};

export const getDatasetSample = (req, res, next) => {
    try {
        const { dataset_id } = req.params;
        const sample = MOCK_SAMPLES[dataset_id];
        if (!sample) {
            return res.status(404).json({ detail: `Sample records for dataset '${dataset_id}' not found` });
        }
        res.json(sample);
    } catch (err) {
        next(err);
    }
};

export const getDatasetDownloadUrl = async (req, res, next) => {
    try {
        const { dataset_id } = req.params;
        const dataset = MOCK_DATASETS.find(d => d.id === dataset_id);
        if (!dataset) {
            return res.status(404).json({ detail: `Dataset with ID '${dataset_id}' not found` });
        }

        const bucketName = process.env.MINIO_BUCKET_NAME || "gigadata-lakehouse";
        const objectName = `gold/features/${dataset_id}.parquet`;

        let downloadUrl = "";
        try {
            const minioClient = getMinioClient();
            downloadUrl = await minioClient.presignedGetObject(bucketName, objectName, 86400);
        } catch (minioErr) {
            console.warn("MinIO connection failed, falling back to mockup signed URL:", minioErr.message);
            downloadUrl = `https://minio.zchpc.co.zw/${bucketName}/${objectName}?expires=86400&token=mock-jwt-signature-for-evaluation`;
        }

        res.json({
            dataset_id,
            download_url: downloadUrl,
            expires_at: new Date(Date.now() + 86400 * 1000).toISOString()
        });
    } catch (err) {
        next(err);
    }
};
