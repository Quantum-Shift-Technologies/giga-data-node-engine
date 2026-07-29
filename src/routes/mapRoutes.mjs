import express from "express";
import {
    getBoundaries,
    getMapTimeline,
    getDistrictDetails,
    getIndicesByFieldId
} from "../controllers/mapController.mjs";

const router = express.Router();

router.get("/boundaries", getBoundaries);
router.get("/timeline", getMapTimeline);
router.get("/districts/:name", getDistrictDetails);
router.get("/indices/:field_id", getIndicesByFieldId);

export default router;
