import express from "express";
import {
    getDatasets,
    getDatasetById,
    getDatasetSchema,
    getDatasetSample,
    getDatasetDownloadUrl
} from "../controllers/datasetController.mjs";

const router = express.Router();

router.get("/", getDatasets);
router.get("/:dataset_id", getDatasetById);
router.get("/:dataset_id/schema", getDatasetSchema);
router.get("/:dataset_id/sample", getDatasetSample);
router.get("/:dataset_id/download", getDatasetDownloadUrl);

export default router;
