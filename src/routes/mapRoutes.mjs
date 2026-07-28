import express from "express";
import {
    getBoundaries,
    getMapTimeline,
    getDistrictDetails
} from "../controllers/mapController.mjs";

const router = express.Router();

router.get("/boundaries", getBoundaries);
router.get("/timeline", getMapTimeline);
router.get("/districts/:name", getDistrictDetails);

export default router;
