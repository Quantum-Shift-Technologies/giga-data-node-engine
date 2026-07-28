import { MOCK_DATASETS, MOCK_SCHEMAS, MOCK_SAMPLES } from "../models/mockData.mjs";

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
