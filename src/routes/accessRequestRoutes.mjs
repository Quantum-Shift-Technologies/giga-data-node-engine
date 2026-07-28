import express from "express";
import {
    submitAccessRequest,
    getAccessRequests
} from "../controllers/accessRequestController.mjs";

const router = express.Router();

router.post("/", submitAccessRequest);
router.get("/", getAccessRequests);

export default router;
